function isObject(valoare) {
  return typeof valoare === "object" && valoare !== null;
}

function fillPlaceholders(text, valori = {}) {
  if (typeof text !== "string") {
    return text;
  }
  
  if (!isObject(valori)) {
    throw new Error("InvalidType");
  }
  
  return text.replace(/\$\{([^}]+)\}/g, (_, cheie) => {
    return Object.prototype.hasOwnProperty.call(valori, cheie) 
      ? valori[cheie] 
      : '${' + cheie + '}';
  });
}

function renderNode(nod, valori = {}) {
  if (!nod || typeof nod !== "object") {
    throw new Error("InvalidType");
  }
  
  if (!nod.tag || typeof nod.tag !== "string") {
    throw new Error("InvalidType");
  }
  
  if (!isObject(valori)) {
    throw new Error("InvalidType");
  }

  let html = `<${nod.tag}`;
  
  if (nod.attrs) {
    if (!isObject(nod.attrs)) {
      throw new Error("InvalidType");
    }
    
    for (const [numeAtribut, valoareAtribut] of Object.entries(nod.attrs)) {
      if (typeof numeAtribut !== "string" || numeAtribut.length === 0) {
        continue;
      }
      
      if (valoareAtribut === true) {
        html += ` ${numeAtribut}`;
        continue;
      }
      if (valoareAtribut === false || valoareAtribut === undefined || valoareAtribut === null) {
        continue;
      }
      html += ` ${numeAtribut}="${fillPlaceholders(String(valoareAtribut), valori)}"`;
    }
  }
  html += ">";

  const copii = Array.isArray(nod.children) ? nod.children : [];
  for (const copil of copii) {
    if (typeof copil === "string") {
      html += fillPlaceholders(copil, valori);
    } else if (isObject(copil)) {
      html += renderNode(copil, valori);
    } else {
      continue;
    }
  }

  html += `</${nod.tag}>`;
  return html;
}

function render(input, valori = {}) {
  if (!isObject(valori)) {
    throw new Error("InvalidType");
  }
  
  if (!Array.isArray(input) && !isObject(input)) {
    throw new Error("InvalidType");
  }

  if (Array.isArray(input)) {
    return input.map((nod) => {
      if (!isObject(nod)) {
        throw new Error("InvalidType");
      }
      return renderNode(nod, valori);
    }).join("");
  }

  if (Object.keys(input).length === 0) {
    return "";
  }
  
  return renderNode(input, valori);
}

function parse(markup = "") {
  if (typeof markup !== "string") {
    throw new Error("InvalidMarkup");
  }

  const text = markup.trim();
  let index = 0;
  const noduri = [];

  const skipSpaces = () => {
    while (index < text.length && /\s/.test(text[index])) {
      index++;
    }
  };

  const readName = () => {
    if (index >= text.length || !/[a-zA-Z]/.test(text[index])) {
      return null;
    }
    let nume = text[index++];
    while (index < text.length && /[a-zA-Z0-9-]/.test(text[index])) {
      nume += text[index++];
    }
    return nume;
  };

  const readAttributes = () => {
    const atribute = {};
    while (index < text.length && text[index] !== ">" && text[index] !== "/") {
      skipSpaces();
      if (text[index] === ">" || text[index] === "/") {
        break;
      }

      const numeAtribut = readName();
      if (!numeAtribut) {
        break;
      }

      skipSpaces();
      if (text[index] === "=") {
        index++;
        skipSpaces();
        if (text[index] !== '"') {
          throw new Error("InvalidMarkup");
        }
        index++;
        let valoare = "";
        while (index < text.length && text[index] !== '"') {
          valoare += text[index++];
        }
        if (index >= text.length || text[index] !== '"') {
          throw new Error("InvalidMarkup");
        }
        index++;
        atribute[numeAtribut] = valoare;
      } else {
        atribute[numeAtribut] = true;
      }
      skipSpaces();
    }
    return Object.keys(atribute).length ? atribute : undefined;
  };

  const parseNode = () => {
    if (index >= text.length || text[index] !== "<") {
      return null;
    }
    index++;

    const numeTag = readName();
    if (!numeTag) {
      throw new Error("InvalidMarkup");
    }

    skipSpaces();
    const atribute = readAttributes();

    if (index < text.length && text[index] === "/") {
      index++;
      if (index >= text.length || text[index] !== ">") {
        throw new Error("InvalidMarkup");
      }
      index++;
      return { tag: numeTag, attrs: atribute, children: [] };
    }

    if (index >= text.length || text[index] !== ">") {
      throw new Error("InvalidMarkup");
    }
    index++;

    const copii = [];
    let inchis = false;
    
    while (index < text.length) {
      if (text[index] === "<" && index + 1 < text.length && text[index + 1] === "/") {
        index += 2;
        const numeInchidere = readName();
        if (numeInchidere !== numeTag) {
          throw new Error("InvalidMarkup");
        }
        if (index >= text.length || text[index] !== ">") {
          throw new Error("InvalidMarkup");
        }
        index++;
        inchis = true;
        break;
      }

      if (text[index] === "<") {
        const copil = parseNode();
        if (copil) {
          copii.push(copil);
        }
        continue;
      }

      let valoare = "";
      while (index < text.length && text[index] !== "<") {
        valoare += text[index++];
      }
      if (valoare.trim()) {
        copii.push(valoare);
      }
    }

    if (!inchis) {
      throw new Error("InvalidMarkup");
    }

    return {
      tag: numeTag,
      attrs: atribute,
      children: copii.length ? copii : undefined,
    };
  };

  while (index < text.length) {
    skipSpaces();
    if (index >= text.length) {
      break;
    }
    const nod = parseNode();
    if (nod) {
      noduri.push(nod);
    }
  }

  return noduri.length === 1 ? noduri[0] : noduri;
}

module.exports = { render, parse };
