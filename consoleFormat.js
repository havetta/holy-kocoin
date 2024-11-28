/* allow pasting */
function syntaxHighlight(json) {      json = json.replace(/`/g, '"');     return json.replace(
  /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|\},\{|\[\{|,)/g,
  function(match) {         if (/^"/.test(match)) {
      if (/:$/.test(match)) { return `<br/><mark><small>${match}</small></mark>`;
      } else { return `<small>${match}</small>`; }
    } else if (/true|false/.test(match)) { return `<u>${match}</u>`;
    } else if (/null/.test(match)) { return `<div><strong>${match}</strong></div>`;
    } else if (/},{/g.test(match)) { return `<hr/>${match}`;
    } else if (/\["|","/g.test(match)) { return `<br/>${match}`; }
    return `${match}`;    });
} const elements = document.getElementsByClassName("Text__qp-rZ4QDiL__text");
Array.from(elements).forEach(e => {    if (/^\s*\{/.test(e.innerHTML))   {
    e.innerHTML = syntaxHighlight(`<blockquote>${e.innerHTML}</blockquote>`);    }     });
document.getElementsByClassName('DetailPanel__IahfoSN304__detailPanel')[0].style.width = '90%'
