function wtgCreateCell(overrides) {
  var base = {
    text: "",
    link: "",
    image: "",
    imageWidth: 80,
    bgColor: "#ffffff",
    color: "#000000",
    align: "center",
    bold: false
  };
  return Object.assign(base, overrides || {});
}

function wtgReplaceAll(text, search, replace) {
  return String(text).split(search).join(replace);
}

function wtgEscapeHtml(str) {
  var text = String(str);
  text = wtgReplaceAll(text, "&", "&amp;");
  text = wtgReplaceAll(text, "<", "&lt;");
  text = wtgReplaceAll(text, ">", "&gt;");
  text = wtgReplaceAll(text, '"', "&quot;");
  text = wtgReplaceAll(text, "'", "&#039;");
  return text;
}

function wtgMakeDefaultState() {
  return {
    title: "표 제목",
    titleLayout: "basic",
    titleImage: "",
    borderWidth: 1,
    collapsible: true,
    collapsed: true,
    animatedToggle: true,
    footer: "",
    colors: {
      titleBg: "#7b818c",
      titleColor: "#ffffff",
      borderColor: "#b8bec8",
      toggleBg: "#f5f6f8"
    },
    rows: 3,
    cols: 3,
    selectedCell: { row: 0, col: 0 },
    cells: [
      [
        wtgCreateCell({ text: "1-1", bgColor: "#eceff3", color: "#374151", bold: true }),
        wtgCreateCell({ text: "1-2", bgColor: "#f7f8fa", color: "#374151" }),
        wtgCreateCell({ text: "1-3", bgColor: "#f7f8fa", color: "#374151" })
      ],
      [
        wtgCreateCell({ text: "2-1", bgColor: "#ffffff", color: "#111827" }),
        wtgCreateCell({ text: "2-2", bgColor: "#ffffff", color: "#111827" }),
        wtgCreateCell({ text: "2-3", bgColor: "#ffffff", color: "#111827" })
      ],
      [
        wtgCreateCell({ text: "3-1", bgColor: "#ffffff", color: "#111827" }),
        wtgCreateCell({ text: "3-2", bgColor: "#ffffff", color: "#111827" }),
        wtgCreateCell({ text: "3-3", bgColor: "#ffffff", color: "#111827" })
      ]
    ]
  };
}

var wtgState = wtgMakeDefaultState();

var wtgEls = {
  titleInput: document.getElementById("wtgTitleInput"),
  titleLayoutSelect: document.getElementById("wtgTitleLayoutSelect"),
  borderWidthInput: document.getElementById("wtgBorderWidthInput"),
  collapsibleInput: document.getElementById("wtgCollapsibleInput"),
  animatedToggleInput: document.getElementById("wtgAnimatedToggleInput"),
  footerInput: document.getElementById("wtgFooterInput"),
  titleBgInput: document.getElementById("wtgTitleBgInput"),
  titleColorInput: document.getElementById("wtgTitleColorInput"),
  borderColorInput: document.getElementById("wtgBorderColorInput"),
  toggleBgInput: document.getElementById("wtgToggleBgInput"),
  titleBgBox: document.getElementById("wtgTitleBgBox"),
  titleColorBox: document.getElementById("wtgTitleColorBox"),
  borderColorBox: document.getElementById("wtgBorderColorBox"),
  toggleBgBox: document.getElementById("wtgToggleBgBox"),
  titleBgText: document.getElementById("wtgTitleBgText"),
  titleColorText: document.getElementById("wtgTitleColorText"),
  borderColorText: document.getElementById("wtgBorderColorText"),
  toggleBgText: document.getElementById("wtgToggleBgText"),
  addRowBtn: document.getElementById("wtgAddRowBtn"),
  removeRowBtn: document.getElementById("wtgRemoveRowBtn"),
  addColBtn: document.getElementById("wtgAddColBtn"),
  removeColBtn: document.getElementById("wtgRemoveColBtn"),
  tableSizeText: document.getElementById("wtgTableSizeText"),
  cellList: document.getElementById("wtgCellList"),
  cellTextInput: document.getElementById("wtgCellTextInput"),
  cellLinkInput: document.getElementById("wtgCellLinkInput"),
  cellImageInput: document.getElementById("wtgCellImageInput"),
  cellImageWidthInput: document.getElementById("wtgCellImageWidthInput"),
  cellAlignInput: document.getElementById("wtgCellAlignInput"),
  cellBgInput: document.getElementById("wtgCellBgInput"),
  cellColorInput: document.getElementById("wtgCellColorInput"),
  cellBgBox: document.getElementById("wtgCellBgBox"),
  cellColorBox: document.getElementById("wtgCellColorBox"),
  cellBgText: document.getElementById("wtgCellBgText"),
  cellColorText: document.getElementById("wtgCellColorText"),
  cellBoldInput: document.getElementById("wtgCellBoldInput"),
  previewRoot: document.getElementById("wtgPreviewRoot"),
  codeOutputStructure: document.getElementById("wtgCodeOutputStructure"),
  codeOutputContent: document.getElementById("wtgCodeOutputContent"),
  copyAllTopBtn: document.getElementById("wtgCopyAllTopBtn"),
  copyAllStructureBtn: document.getElementById("wtgCopyAllStructureBtn"),
  copyAllContentBtn: document.getElementById("wtgCopyAllContentBtn"),
  tabButtons: document.querySelectorAll(".wtg-tab-button"),
  tabPanels: document.querySelectorAll(".wtg-tab-panel"),
  boldBtn: document.getElementById("wtgBoldBtn"),
  italicBtn: document.getElementById("wtgItalicBtn"),
  strikeBtn: document.getElementById("wtgStrikeBtn"),
  linkBtn: document.getElementById("wtgLinkBtn")
};

function wtgGetSelectedCell() {
  return wtgState.cells[wtgState.selectedCell.row][wtgState.selectedCell.col];
}

function wtgSetColorBox(box, textEl, value) {
  if (box) box.style.background = value;
  if (textEl) textEl.textContent = value;
}

function wtgApplyStateToInputs() {
  var cell = wtgGetSelectedCell();
  wtgEls.titleInput.value = wtgState.title;
  wtgEls.titleLayoutSelect.value = wtgState.titleLayout;
  wtgEls.borderWidthInput.value = String(wtgState.borderWidth);
  wtgEls.collapsibleInput.checked = wtgState.collapsible;
  wtgEls.animatedToggleInput.checked = wtgState.animatedToggle;
  wtgEls.footerInput.value = wtgState.footer;
  wtgEls.titleBgInput.value = wtgState.colors.titleBg;
  wtgEls.titleColorInput.value = wtgState.colors.titleColor;
  wtgEls.borderColorInput.value = wtgState.colors.borderColor;
  wtgEls.toggleBgInput.value = wtgState.colors.toggleBg;
  wtgEls.cellTextInput.value = cell.text;
  wtgEls.cellLinkInput.value = cell.link;
  wtgEls.cellImageInput.value = cell.image;
  wtgEls.cellImageWidthInput.value = String(cell.imageWidth);
  wtgEls.cellAlignInput.value = cell.align;
  wtgEls.cellBgInput.value = cell.bgColor;
  wtgEls.cellColorInput.value = cell.color;
  wtgEls.cellBoldInput.checked = cell.bold;

  wtgSetColorBox(wtgEls.titleBgBox, wtgEls.titleBgText, wtgState.colors.titleBg);
  wtgSetColorBox(wtgEls.titleColorBox, wtgEls.titleColorText, wtgState.colors.titleColor);
  wtgSetColorBox(wtgEls.borderColorBox, wtgEls.borderColorText, wtgState.colors.borderColor);
  wtgSetColorBox(wtgEls.toggleBgBox, wtgEls.toggleBgText, wtgState.colors.toggleBg);
  wtgSetColorBox(wtgEls.cellBgBox, wtgEls.cellBgText, cell.bgColor);
  wtgSetColorBox(wtgEls.cellColorBox, wtgEls.cellColorText, cell.color);
}

function wtgSetActiveTab(tabName) {
  wtgEls.tabButtons.forEach(function (button) {
    button.classList.toggle("wtg-active", button.getAttribute("data-tab") === tabName);
  });
  wtgEls.tabPanels.forEach(function (panel) {
    panel.classList.toggle("wtg-active", panel.getAttribute("data-panel") === tabName);
  });
}

function wtgRenderCellButtons() {
  var r;
  var c;
  wtgEls.cellList.innerHTML = "";

  for (r = 0; r < wtgState.rows; r += 1) {
    for (c = 0; c < wtgState.cols; c += 1) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "wtg-cell-chip" + (wtgState.selectedCell.row === r && wtgState.selectedCell.col === c ? " wtg-active" : "");
      button.textContent = (r + 1) + "-" + (c + 1);
      button.dataset.row = String(r);
      button.dataset.col = String(c);
      button.addEventListener("click", function () {
        wtgState.selectedCell = {
          row: Number(this.dataset.row),
          col: Number(this.dataset.col)
        };
        wtgApplyStateToInputs();
        wtgSetActiveTab("content");
        wtgRender(false);
      });
      wtgEls.cellList.appendChild(button);
    }
  }

  wtgEls.tableSizeText.textContent = "현재 표 크기는 " + wtgState.rows + "행 × " + wtgState.cols + "열입니다.";
}

function wtgParseInlineMarkup(text) {
  var html = wtgEscapeHtml(text);
  html = html.replace(/\[\[(https?:\/\/[^\]|]+)\|([^\]]+)\]\]/g, '<a href="$1" target="_blank" rel="noreferrer noopener">$2</a>');
  html = html.replace(/\[\[(https?:\/\/[^\]]+)\]\]/g, '<a href="$1" target="_blank" rel="noreferrer noopener">$1</a>');
  html = html.replace(/'''([^']+?)'''/g, '<strong>$1</strong>');
  html = html.replace(/''([^']+?)''/g, '<em>$1</em>');
  html = html.replace(/~~([^~]+?)~~/g, '<s>$1</s>');
  html = wtgReplaceAll(html, "\n", "<br>");
  return html;
}

function wtgFormatTextForPreview(cell) {
  var content = wtgParseInlineMarkup(cell.text);
  var rawLink = cell.link.trim();

  if (rawLink) {
    if (rawLink.indexOf("[[") === 0 && rawLink.lastIndexOf("]]") === rawLink.length - 2) {
      content = "<span>" + wtgEscapeHtml(rawLink) + "</span>" + (content ? "<br>" + content : "");
    } else {
      var href = wtgEscapeHtml(rawLink);
      content = '<a href="' + href + '" target="_blank" rel="noreferrer noopener">' + (content || href) + '</a>';
    }
  }

  if (cell.bold) {
    content = "<strong>" + content + "</strong>";
  }

  return content;
}

function wtgApplyToggleState(contentEl, collapsed, animated, force) {
  var fullHeight;
  if (!contentEl) return;
  fullHeight = contentEl.scrollHeight;

  if (!animated || force) {
    contentEl.classList.remove("wtg-animated");
    contentEl.style.height = collapsed ? "0px" : "auto";
    contentEl.style.opacity = collapsed ? "0" : "1";
    return;
  }

  contentEl.classList.add("wtg-animated");
  if (collapsed) {
    contentEl.style.height = fullHeight + "px";
    contentEl.style.opacity = "1";
    requestAnimationFrame(function () {
      contentEl.style.height = "0px";
      contentEl.style.opacity = "0";
    });
  } else {
    contentEl.style.height = fullHeight + "px";
    contentEl.style.opacity = "1";
  }
}

function wtgBuildTitleHtml() {
  var imageCell = wtgGetSelectedCell();
  var imageUrl = imageCell.image.trim();
  var imageWidth = Number(imageCell.imageWidth) || 80;
  var text = wtgEscapeHtml(wtgState.title).replace(/\n/g, "<br>");

  if (wtgState.titleLayout === "composite") {
    return '<div class="wtg-title-composite">' +
      '<div class="wtg-title-composite-media">' + (imageUrl ? '<img src="' + wtgEscapeHtml(imageUrl) + '" style="width:' + imageWidth + 'px;" alt="" />' : '') + '</div>' +
      '<div class="wtg-title-divider"></div>' +
      '<div class="wtg-title-composite-text">' + text + '</div>' +
      '</div>';
  }

  return '<div class="wtg-title-basic">' +
    (imageUrl ? '<img src="' + wtgEscapeHtml(imageUrl) + '" style="width:' + imageWidth + 'px;" alt="" />' : '') +
    '<div class="wtg-title-basic-text">' + text + '</div>' +
    '</div>';
}

function wtgRenderPreview(useAnimation) {
  var rowsHtml = "";
  var r;
  var c;

  for (r = 0; r < wtgState.rows; r += 1) {
    rowsHtml += "<tr>";
    for (c = 0; c < wtgState.cols; c += 1) {
      var cell = wtgState.cells[r][c];
      var imageHtml = "";
      var selectedClass = wtgState.selectedCell.row === r && wtgState.selectedCell.col === c ? "wtg-selected" : "";
      if (cell.image.trim()) {
        imageHtml = '<img class="wtg-cell-image" src="' + wtgEscapeHtml(cell.image) + '" style="width:' + (Number(cell.imageWidth) || 80) + 'px;" alt="" />';
      }
      rowsHtml += '<td data-row="' + r + '" data-col="' + c + '" class="' + selectedClass + '" style="background:' + cell.bgColor + '; color:' + cell.color + '; text-align:' + cell.align + '; font-weight:' + (cell.bold ? 700 : 400) + '; border-color:' + wtgState.colors.borderColor + '; border-width:' + wtgState.borderWidth + 'px;">' + imageHtml + wtgFormatTextForPreview(cell) + '</td>';
    }
    rowsHtml += "</tr>";
  }

  var html = '';
  html += '<div class="wtg-box" style="border:' + wtgState.borderWidth + 'px solid ' + wtgState.colors.borderColor + ';">';
  html += '<div class="wtg-title" style="background:' + wtgState.colors.titleBg + '; color:' + wtgState.colors.titleColor + '; border-bottom:' + wtgState.borderWidth + 'px solid ' + wtgState.colors.borderColor + ';">' + wtgBuildTitleHtml() + '</div>';
  if (wtgState.collapsible) {
    html += '<div class="wtg-toggle" id="wtgPreviewToggle" style="background:' + wtgState.colors.toggleBg + '; color:#374151; border-bottom:' + wtgState.borderWidth + 'px solid ' + wtgState.colors.borderColor + ';">[ ' + (wtgState.collapsed ? '펼치기' : '접기') + ' ]</div>';
  }
  html += '<div class="wtg-toggle-content" id="wtgPreviewToggleContent">';
  html += '<div class="wtg-table-wrap">';
  html += '<table class="wtg-table"><tbody>' + rowsHtml + '</tbody></table>';
  if (wtgState.footer.trim()) {
    html += '<div class="wtg-footer" style="border-top:' + wtgState.borderWidth + 'px solid ' + wtgState.colors.borderColor + '; color:#4b5563;">' + wtgReplaceAll(wtgEscapeHtml(wtgState.footer), "\n", '<br>') + '</div>';
  }
  html += '</div></div></div>';

  wtgEls.previewRoot.innerHTML = html;

  var contentEl = document.getElementById("wtgPreviewToggleContent");
  if (wtgState.collapsible) {
    wtgApplyToggleState(contentEl, wtgState.collapsed, wtgState.animatedToggle, !useAnimation);
  } else {
    contentEl.style.height = "auto";
    contentEl.style.opacity = "1";
  }

  var toggle = document.getElementById("wtgPreviewToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      wtgState.collapsed = !wtgState.collapsed;
      wtgApplyToggleState(contentEl, wtgState.collapsed, wtgState.animatedToggle, false);
      this.textContent = '[ ' + (wtgState.collapsed ? '펼치기' : '접기') + ' ]';
      wtgRenderExportCode();
    });
  }

  var cells = wtgEls.previewRoot.querySelectorAll("td[data-row][data-col]");
  cells.forEach(function (td) {
    td.addEventListener("click", function () {
      wtgState.selectedCell = {
        row: Number(td.dataset.row),
        col: Number(td.dataset.col)
      };
      wtgApplyStateToInputs();
      wtgSetActiveTab("content");
      wtgRender(false);
    });
  });
}

function wtgBuildExportCode() {
  return document.documentElement.outerHTML;
}

function wtgRenderExportCode() {
  var code = wtgBuildExportCode();
  wtgEls.codeOutputStructure.textContent = code;
  wtgEls.codeOutputContent.textContent = code;
}

function wtgRender(useAnimation) {
  wtgRenderCellButtons();
  wtgRenderPreview(useAnimation);
  wtgRenderExportCode();
}

function wtgCopyText(text, button) {
  navigator.clipboard.writeText(text)
    .then(function () {
      var original = button.textContent;
      button.textContent = "복사 완료";
      setTimeout(function () {
        button.textContent = original;
      }, 1200);
    })
    .catch(function () {
      alert("복사에 실패했습니다. 코드를 직접 선택하여 복사해 주세요.");
    });
}

function wtgOpenColorInput(input) {
  if (input && typeof input.showPicker === "function") {
    input.showPicker();
  } else if (input) {
    input.click();
  }
}

function wtgWrapSelection(before, after) {
  var textarea = wtgEls.cellTextInput;
  var start = textarea.selectionStart;
  var end = textarea.selectionEnd;
  var value = textarea.value;
  var selected = value.slice(start, end);
  var next = value.slice(0, start) + before + selected + after + value.slice(end);
  textarea.value = next;
  textarea.focus();
  textarea.selectionStart = start + before.length;
  textarea.selectionEnd = end + before.length;
  wtgGetSelectedCell().text = textarea.value;
  wtgRender(false);
}

function wtgInsertLink() {
  var textarea = wtgEls.cellTextInput;
  var start = textarea.selectionStart;
  var end = textarea.selectionEnd;
  var selected = textarea.value.slice(start, end) || "링크 텍스트";
  var url = prompt("링크 주소를 입력해 주세요.", "https://");
  var value;
  if (!url) return;
  value = textarea.value;
  textarea.value = value.slice(0, start) + "[[" + url + "|" + selected + "]]" + value.slice(end);
  textarea.focus();
  textarea.selectionStart = start;
  textarea.selectionEnd = start + ("[[" + url + "|" + selected + "]]").length;
  wtgGetSelectedCell().text = textarea.value;
  wtgRender(false);
}

wtgEls.tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    wtgSetActiveTab(button.getAttribute("data-tab"));
  });
});

wtgEls.titleBgBox.addEventListener("click", function () { wtgOpenColorInput(wtgEls.titleBgInput); });
wtgEls.titleColorBox.addEventListener("click", function () { wtgOpenColorInput(wtgEls.titleColorInput); });
wtgEls.borderColorBox.addEventListener("click", function () { wtgOpenColorInput(wtgEls.borderColorInput); });
wtgEls.toggleBgBox.addEventListener("click", function () { wtgOpenColorInput(wtgEls.toggleBgInput); });
wtgEls.cellBgBox.addEventListener("click", function () { wtgOpenColorInput(wtgEls.cellBgInput); });
wtgEls.cellColorBox.addEventListener("click", function () { wtgOpenColorInput(wtgEls.cellColorInput); });

wtgEls.titleInput.addEventListener("input", function (e) {
  wtgState.title = e.target.value;
  wtgRender(false);
});

wtgEls.titleLayoutSelect.addEventListener("change", function (e) {
  wtgState.titleLayout = e.target.value;
  wtgRender(false);
});

wtgEls.borderWidthInput.addEventListener("input", function (e) {
  wtgState.borderWidth = Number(e.target.value) || 1;
  wtgRender(false);
});

wtgEls.collapsibleInput.addEventListener("change", function (e) {
  wtgState.collapsible = e.target.checked;
  wtgRender(false);
});

wtgEls.animatedToggleInput.addEventListener("change", function (e) {
  wtgState.animatedToggle = e.target.checked;
  wtgRender(false);
});

wtgEls.footerInput.addEventListener("input", function (e) {
  wtgState.footer = e.target.value;
  wtgRender(false);
});

wtgEls.titleBgInput.addEventListener("input", function (e) {
  wtgState.colors.titleBg = e.target.value;
  wtgApplyStateToInputs();
  wtgRender(false);
});

wtgEls.titleColorInput.addEventListener("input", function (e) {
  wtgState.colors.titleColor = e.target.value;
  wtgApplyStateToInputs();
  wtgRender(false);
});

wtgEls.borderColorInput.addEventListener("input", function (e) {
  wtgState.colors.borderColor = e.target.value;
  wtgApplyStateToInputs();
  wtgRender(false);
});

wtgEls.toggleBgInput.addEventListener("input", function (e) {
  wtgState.colors.toggleBg = e.target.value;
  wtgApplyStateToInputs();
  wtgRender(false);
});

wtgEls.addRowBtn.addEventListener("click", function () {
  var newRowIndex = wtgState.rows;
  var newRow = [];
  var colIndex;
  for (colIndex = 0; colIndex < wtgState.cols; colIndex += 1) {
    newRow.push(wtgCreateCell({
      text: (newRowIndex + 1) + "-" + (colIndex + 1),
      bgColor: "#ffffff",
      color: "#111827"
    }));
  }
  wtgState.cells.push(newRow);
  wtgState.rows += 1;
  wtgRender(false);
});

wtgEls.removeRowBtn.addEventListener("click", function () {
  if (wtgState.rows <= 1) return;
  wtgState.cells.pop();
  wtgState.rows -= 1;
  if (wtgState.selectedCell.row >= wtgState.rows) {
    wtgState.selectedCell.row = wtgState.rows - 1;
  }
  wtgApplyStateToInputs();
  wtgRender(false);
});

wtgEls.addColBtn.addEventListener("click", function () {
  wtgState.cells.forEach(function (row, rowIndex) {
    row.push(wtgCreateCell({
      text: (rowIndex + 1) + "-" + (wtgState.cols + 1),
      bgColor: "#ffffff",
      color: "#111827"
    }));
  });
  wtgState.cols += 1;
  wtgRender(false);
});

wtgEls.removeColBtn.addEventListener("click", function () {
  if (wtgState.cols <= 1) return;
  wtgState.cells.forEach(function (row) {
    row.pop();
  });
  wtgState.cols -= 1;
  if (wtgState.selectedCell.col >= wtgState.cols) {
    wtgState.selectedCell.col = wtgState.cols - 1;
  }
  wtgApplyStateToInputs();
  wtgRender(false);
});

wtgEls.cellTextInput.addEventListener("input", function (e) {
  wtgGetSelectedCell().text = e.target.value;
  wtgRender(false);
});

wtgEls.cellLinkInput.addEventListener("input", function (e) {
  wtgGetSelectedCell().link = e.target.value;
  wtgRender(false);
});

wtgEls.cellImageInput.addEventListener("input", function (e) {
  wtgGetSelectedCell().image = e.target.value;
  wtgRender(false);
});

wtgEls.cellImageWidthInput.addEventListener("input", function (e) {
  wtgGetSelectedCell().imageWidth = Number(e.target.value) || 80;
  wtgRender(false);
});

wtgEls.cellAlignInput.addEventListener("change", function (e) {
  wtgGetSelectedCell().align = e.target.value;
  wtgRender(false);
});

wtgEls.cellBgInput.addEventListener("input", function (e) {
  wtgGetSelectedCell().bgColor = e.target.value;
  wtgApplyStateToInputs();
  wtgRender(false);
});

wtgEls.cellColorInput.addEventListener("input", function (e) {
  wtgGetSelectedCell().color = e.target.value;
  wtgApplyStateToInputs();
  wtgRender(false);
});

wtgEls.cellBoldInput.addEventListener("change", function (e) {
  wtgGetSelectedCell().bold = e.target.checked;
  wtgRender(false);
});

wtgEls.boldBtn.addEventListener("click", function () { wtgWrapSelection("'''", "'''"); });
wtgEls.italicBtn.addEventListener("click", function () { wtgWrapSelection("''", "''"); });
wtgEls.strikeBtn.addEventListener("click", function () { wtgWrapSelection("~~", "~~"); });
wtgEls.linkBtn.addEventListener("click", function () { wtgInsertLink(); });

function wtgCopyAll(button) {
  wtgCopyText(wtgBuildExportCode(), button);
}

wtgEls.copyAllTopBtn.addEventListener("click", function () { wtgCopyAll(wtgEls.copyAllTopBtn); });
wtgEls.copyAllStructureBtn.addEventListener("click", function () { wtgCopyAll(wtgEls.copyAllStructureBtn); });
wtgEls.copyAllContentBtn.addEventListener("click", function () { wtgCopyAll(wtgEls.copyAllContentBtn); });

wtgApplyStateToInputs();
wtgSetActiveTab("structure");
wtgRender(false);
