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
        wtgCreateCell({ text: "행 1 · 열 1", bgColor: "#eceff3", color: "#374151", bold: true }),
        wtgCreateCell({ text: "행 1 · 열 2", bgColor: "#f7f8fa", color: "#374151" }),
        wtgCreateCell({ text: "행 1 · 열 3", bgColor: "#f7f8fa", color: "#374151" })
      ],
      [
        wtgCreateCell({ text: "행 2 · 열 1", bgColor: "#ffffff", color: "#111827" }),
        wtgCreateCell({ text: "행 2 · 열 2", bgColor: "#ffffff", color: "#111827" }),
        wtgCreateCell({ text: "행 2 · 열 3", bgColor: "#ffffff", color: "#111827" })
      ],
      [
        wtgCreateCell({ text: "행 3 · 열 1", bgColor: "#ffffff", color: "#111827" }),
        wtgCreateCell({ text: "행 3 · 열 2", bgColor: "#ffffff", color: "#111827" }),
        wtgCreateCell({ text: "행 3 · 열 3", bgColor: "#ffffff", color: "#111827" })
      ]
    ]
  };
}

var wtgState = wtgMakeDefaultState();
var wtgEditorOpen = false;

var wtgEls = {
  titleInput: document.getElementById("wtgTitleInput"),
  collapsibleInput: document.getElementById("wtgCollapsibleInput"),
  animatedToggleInput: document.getElementById("wtgAnimatedToggleInput"),
  footerInput: document.getElementById("wtgFooterInput"),
  titleBgInput: document.getElementById("wtgTitleBgInput"),
  titleColorInput: document.getElementById("wtgTitleColorInput"),
  borderColorInput: document.getElementById("wtgBorderColorInput"),
  toggleBgInput: document.getElementById("wtgToggleBgInput"),
  titleBgPreview: document.getElementById("wtgTitleBgPreview"),
  titleColorPreview: document.getElementById("wtgTitleColorPreview"),
  borderColorPreview: document.getElementById("wtgBorderColorPreview"),
  toggleBgPreview: document.getElementById("wtgToggleBgPreview"),
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
  cellBgPreview: document.getElementById("wtgCellBgPreview"),
  cellColorPreview: document.getElementById("wtgCellColorPreview"),
  cellBoldInput: document.getElementById("wtgCellBoldInput"),
  previewRoot: document.getElementById("wtgPreviewRoot"),
  codeOutput: document.getElementById("wtgCodeOutput"),
  copyMarkupBtn: document.getElementById("wtgCopyMarkupBtn"),
  copyHtmlBtn: document.getElementById("wtgCopyHtmlBtn"),
  copyCssBtn: document.getElementById("wtgCopyCssBtn"),
  copyJsBtn: document.getElementById("wtgCopyJsBtn"),
  tabButtons: document.querySelectorAll(".wtg-tab-button"),
  tabPanels: document.querySelectorAll(".wtg-tab-panel")
};

function wtgGetSelectedCell() {
  return wtgState.cells[wtgState.selectedCell.row][wtgState.selectedCell.col];
}

function wtgUpdateColorPreview(previewEl, value) {
  if (previewEl) {
    previewEl.style.background = value;
  }
}

function wtgApplyStateToInputs() {
  var cell = wtgGetSelectedCell();

  wtgEls.titleInput.value = wtgState.title;
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

  wtgUpdateColorPreview(wtgEls.titleBgPreview, wtgState.colors.titleBg);
  wtgUpdateColorPreview(wtgEls.titleColorPreview, wtgState.colors.titleColor);
  wtgUpdateColorPreview(wtgEls.borderColorPreview, wtgState.colors.borderColor);
  wtgUpdateColorPreview(wtgEls.toggleBgPreview, wtgState.colors.toggleBg);
  wtgUpdateColorPreview(wtgEls.cellBgPreview, cell.bgColor);
  wtgUpdateColorPreview(wtgEls.cellColorPreview, cell.color);
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
      var previewText = wtgState.cells[r][c].text.trim() || "빈 셀";

      button.type = "button";
      button.className = "wtg-cell-chip" + (wtgState.selectedCell.row === r && wtgState.selectedCell.col === c ? " wtg-active" : "");
      button.textContent = "행 " + (r + 1) + " · 열 " + (c + 1) + " · " + previewText.slice(0, 12);
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

function wtgFormatTextForPreview(cell) {
  var content = wtgReplaceAll(wtgEscapeHtml(cell.text), "\n", "<br>");
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

  if (!contentEl) {
    return;
  }

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

      rowsHtml += '<td data-row="' + r + '" data-col="' + c + '" class="' + selectedClass + '" style="background:' + cell.bgColor + '; color:' + cell.color + '; text-align:' + cell.align + '; font-weight:' + (cell.bold ? 700 : 400) + '; border-color:' + wtgState.colors.borderColor + ';">' + imageHtml + wtgFormatTextForPreview(cell) + '</td>';
    }

    rowsHtml += "</tr>";
  }

  var html = '';
  html += '<div class="wtg-box" style="border:1px solid ' + wtgState.colors.borderColor + ';">';
  html += '<div class="wtg-title" style="background:' + wtgState.colors.titleBg + '; color:' + wtgState.colors.titleColor + '; border-bottom:1px solid ' + wtgState.colors.borderColor + ';">' + wtgEscapeHtml(wtgState.title) + '</div>';

  if (wtgState.collapsible) {
    html += '<div class="wtg-toggle" id="wtgPreviewToggle" style="background:' + wtgState.colors.toggleBg + '; color:#374151; border-bottom:1px solid ' + wtgState.colors.borderColor + ';">[ ' + (wtgState.collapsed ? '펼치기' : '접기') + ' ]</div>';
  }

  html += '<div class="wtg-toggle-content" id="wtgPreviewToggleContent">';
  html += '<div class="wtg-table-wrap">';
  html += '<table class="wtg-table"><tbody>' + rowsHtml + '</tbody></table>';

  if (wtgState.footer.trim()) {
    html += '<div class="wtg-footer" style="border-top:1px solid ' + wtgState.colors.borderColor + '; color:#4b5563;">' + wtgReplaceAll(wtgEscapeHtml(wtgState.footer), "\n", '<br>') + '</div>';
  }

  html += '</div>';
  html += '</div>';
  html += '</div>';

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
      wtgRenderMarkupOnly();
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

function wtgBuildCellMarkup(cell) {
  var styleParts = [];
  var content = cell.text || " ";
  var rawLink = cell.link.trim();
  var imageMarkup = "";

  if (cell.bgColor) styleParts.push("bgcolor=" + cell.bgColor);
  if (cell.color) styleParts.push("color=" + cell.color);
  if (cell.align) styleParts.push("align=" + cell.align);

  if (cell.image.trim()) {
    imageMarkup = "[[파일:" + cell.image + "|width=" + (Number(cell.imageWidth) || 80) + "]]";
    content = content.trim() ? imageMarkup + "[br]" + content : imageMarkup;
  }

  if (rawLink) {
    if (rawLink.indexOf("[[") === 0 && rawLink.lastIndexOf("]]") === rawLink.length - 2) {
      content = rawLink + (content.trim() ? "[br]" + content : "");
    } else {
      content = "[" + rawLink + " " + content + "]";
    }
  }

  if (cell.bold) {
    content = "'''" + content + "'''";
  }

  content = wtgReplaceAll(content, "\n", "[br]");
  return "||<" + styleParts.join("><") + "> " + content + " ";
}

function wtgBuildMarkupCode() {
  var lines = [];

  lines.push("||<table align=center><table bordercolor=" + wtgState.colors.borderColor + "><bgcolor=" + wtgState.colors.titleBg + "><color=" + wtgState.colors.titleColor + "> '''" + (wtgState.title || "표 제목") + "''' ||");

  if (wtgState.collapsible) {
    lines.push("||<bgcolor=" + wtgState.colors.toggleBg + "><- " + (wtgState.collapsed ? "[펼치기]" : "[접기]") + " ||");
  }

  wtgState.cells.forEach(function (row) {
    var line = row.map(wtgBuildCellMarkup).join("") + "||";
    lines.push(line);
  });

  if (wtgState.footer.trim()) {
    lines.push("||<bgcolor=#f5f6f8><color=#4b5563><- " + wtgState.cols + "> " + wtgReplaceAll(wtgState.footer, "\n", "[br]") + " ||");
  }

  return lines.join("\n");
}

function wtgRenderMarkupOnly() {
  wtgEls.codeOutput.textContent = wtgBuildMarkupCode();
}

function wtgBuildHtmlFile() {
  return [
    "<!DOCTYPE html>",
    '<html lang="ko">',
    "<head>",
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <title>위키 접기/펼치기 표 생성기</title>',
    '  <link rel="stylesheet" href="style.css" />',
    "</head>",
    "<body>",
    document.documentElement.outerHTML.split("<body>")[1].split("<script src=\"script.js\"></script>")[0] + '  <script src="script.js"></script>\n</body>\n</html>'
  ].join("\n");
}

function wtgRender(useAnimation) {
  wtgRenderCellButtons();
  wtgRenderPreview(useAnimation);
  wtgRenderMarkupOnly();
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

wtgEls.tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    wtgSetActiveTab(button.getAttribute("data-tab"));
  });
});

wtgEls.titleInput.addEventListener("input", function (e) {
  wtgState.title = e.target.value;
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
  wtgUpdateColorPreview(wtgEls.titleBgPreview, e.target.value);
  wtgRender(false);
});

wtgEls.titleColorInput.addEventListener("input", function (e) {
  wtgState.colors.titleColor = e.target.value;
  wtgUpdateColorPreview(wtgEls.titleColorPreview, e.target.value);
  wtgRender(false);
});

wtgEls.borderColorInput.addEventListener("input", function (e) {
  wtgState.colors.borderColor = e.target.value;
  wtgUpdateColorPreview(wtgEls.borderColorPreview, e.target.value);
  wtgRender(false);
});

wtgEls.toggleBgInput.addEventListener("input", function (e) {
  wtgState.colors.toggleBg = e.target.value;
  wtgUpdateColorPreview(wtgEls.toggleBgPreview, e.target.value);
  wtgRender(false);
});

wtgEls.addRowBtn.addEventListener("click", function () {
  var newRowIndex = wtgState.rows;
  var newRow = [];
  var colIndex;

  for (colIndex = 0; colIndex < wtgState.cols; colIndex += 1) {
    newRow.push(wtgCreateCell({
      text: "행 " + (newRowIndex + 1) + " · 열 " + (colIndex + 1),
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
      text: "행 " + (rowIndex + 1) + " · 열 " + (wtgState.cols + 1),
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
  wtgUpdateColorPreview(wtgEls.cellBgPreview, e.target.value);
  wtgRender(false);
});

wtgEls.cellColorInput.addEventListener("input", function (e) {
  wtgGetSelectedCell().color = e.target.value;
  wtgUpdateColorPreview(wtgEls.cellColorPreview, e.target.value);
  wtgRender(false);
});

wtgEls.cellBoldInput.addEventListener("change", function (e) {
  wtgGetSelectedCell().bold = e.target.checked;
  wtgRender(false);
});

wtgEls.copyMarkupBtn.addEventListener("click", function () {
  wtgCopyText(wtgBuildMarkupCode(), wtgEls.copyMarkupBtn);
});

wtgEls.copyHtmlBtn.addEventListener("click", function () {
  wtgCopyText(document.documentElement.outerHTML, wtgEls.copyHtmlBtn);
});

wtgEls.copyCssBtn.addEventListener("click", function () {
  var cssText = Array.from(document.styleSheets[0].cssRules).map(function (rule) {
    return rule.cssText;
  }).join("\n\n");
  wtgCopyText(cssText, wtgEls.copyCssBtn);
});

wtgEls.copyJsBtn.addEventListener("click", function () {
  var scriptText = document.querySelector('script[src="script.js"]');
  if (scriptText) {
    fetch(scriptText.getAttribute("src"))
      .then(function (response) { return response.text(); })
      .then(function (text) { wtgCopyText(text, wtgEls.copyJsBtn); })
      .catch(function () { alert("JS 복사에 실패했습니다."); });
  }
});

wtgApplyStateToInputs();
wtgSetActiveTab("structure");
wtgRender(false);
