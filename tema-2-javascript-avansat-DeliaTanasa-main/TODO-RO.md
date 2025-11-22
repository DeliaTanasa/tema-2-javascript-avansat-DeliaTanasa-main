# Tema 2 (2.5 pts)

# Tematica: JavaScript

# Partea I — Funcția `render(input, values)`

Se dă funcția `function render(input, values)` unde:

- `input` reprezintă un obiect (sau o listă de obiecte) ce descrie o structură de tip arbore de tag-uri;
- `values` este un obiect cu perechi cheie-valoare utilizat pentru substituția token-urilor;
- Funcția trebuie să genereze un string în format HTML-like, respectând regulile de mai jos:

### Modelul unui nod:

```js
{
  tag: 'div',
  attrs: { id: 'main', hidden: true },
  children: [
    'Salut ',
    { tag: 'b', children: ['lume'] }
  ]
}
```

### Reguli de randare:

- Atributele de tip **string** se afișează ca `cheie="valoare"`.
- Atributele de tip **boolean** se afișează doar prin prezență (`hidden` în exemplul de mai sus).
- Nodurile copil pot fi fie string-uri (text), fie alte obiecte cu același model.
- Token-urile de forma `${key}` din text sau atribute se înlocuiesc cu valoarea corespunzătoare din `values`.
- Dacă `input` este o listă, nodurile de nivel superior se concatenează direct în rezultat.

### Cerințe:

- funcția returnează un string vid dacă primul parametru este un obiect vid; (0.25 pts)
- funcția aruncă o excepție cu mesajul `InvalidType` dacă unul dintre parametri nu este de tip obiect; (0.25 pts)
- funcția afișează corect un tag simplu; (0.25 pts)
- funcția tratează corect atributele string și boolean; (0.25 pts)
- funcția realizează corect substituția de token-uri în text și atribute; (0.25 pts)
- funcția procesează corect o structură complexă, cu noduri imbricate și mai multe rădăcini; (0.25 pts)

---

# Partea II — Funcția `parse(markup)`

Se dă funcția `function parse(markup)` unde:

- `markup` este un string generat de `render`;
- Funcția trebuie să reconstruiască obiectul (sau lista de obiecte) corespunzător structurii de tag-uri.

### Reguli de parsare:

- Atributele fără valoare devin booleene (`true`);
- Atributele cu valoare (`key="value"`) devin string-uri;
- Textul dintre tag-uri devine nod text (string);
- Tag-urile imbricate trebuie recunoscute și reintroduse în structura `children`;
- Dacă există mai multe noduri de rădăcină, funcția returnează o listă de noduri;
- În caz de eroare de structură (tag-uri închise greșit, tag-uri incomplete etc.), funcția aruncă o excepție cu mesajul `InvalidMarkup`.

### Cerințe:

- funcția parsează corect un tag simplu cu text; (0.25 pts)
- funcția parsează corect atributele string și boolean; (0.25 pts)
- funcția recunoaște corect noduri imbricate; (0.25 pts)
- funcția păstrează ordinea elementelor text și tag-uri copil; (0.25 pts)
- funcția gestionează mai multe noduri rădăcină; (0.25 pts)
- funcția aruncă `InvalidMarkup` pentru structură invalidă; (0.25 pts)

---

### Pași pentru a rula testele și a trimite tema:

1. Acceptă assignment-ul primit pe platforma GitHub Classroom
2. Descarcă repository-ul personal creat în cadrul platformei
3. În directorul principal rulează comanda `npm install` pentru a instala modulele necesare executării testelor
4. Adaugă implementarea necesară rezolvării cerințelor în fișierul `app.js` din directorul principal
5. În directorul principal rulează comanda `npm test` pentru a rula testele
   - poți folosi o comandă de testare parțială pentru fiecare cerință: `npm run test-parse-0`
6. Verifică rezultatul testelor
   - Teste picate
     ![Rulare teste](./assets/teste-bad.png)
   - Teste valide
     ![Rulare teste](./assets/teste-good.png)
7. După rezolvarea cerințelor creează un commit și folosește comanda push pentru a încărca modificările pe GitHub (detalii în primul seminar)
