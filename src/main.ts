import 'water.css/out/water.css';
import './style.css';

import { component } from 'lucia';

interface Card {
  year: string;
  title: string;
  authors: string;
  abstract: string;
  keywords: string;
  paper: string;
  poster: string;
  video: string;
}

const createCard = (
  year: string,
  title: string,
  authors: string,
  abstract: string,
  keywords: string,
  paper: string,
  poster: string,
  video: string,
  index: number
): string => `
  <summary><b>${title}</b></summary>
  <p>
    <b>Year:</b> ${year}
  </p>
  <p>
    <b>Authors:</b> ${authors}
  </p>
  <p>
    <b>Keywords:</b> ${keywords}
  </p>
  <p>
    <b>Links:</b> <a href="${paper}" target="_blank">Paper</a> | <a target="_blank" href="${poster}">Poster</a> | <a href="${video}" target="_blank">Video</a>
  </p>
  <p>
    <b>Abstract:</b><br>${abstract}
  </p>
  <p :style="{ display: !!(new URLSearchParams(window.location.search).get('project')) ? 'none' : 'block' }">
    <b>Share Link:</b>
    <input value="${window.location.origin}/?project=${index}" style="width: 50%" />
    <a href="${window.location.origin}/?project=${index}">ℹ️ Open as page</a>
  </p>
`;

fetch('https://literallyjustanabel.aidenbai.repl.co/mst')
  .then((res) => res.json())
  .then((rows: Card[]) => {
    const c = component({ catalog: [], query: '' });
    const urlParams = new URLSearchParams(window.location.search);
    const project = urlParams.get('project');

    if (project) {
      const { year, title, authors, abstract, keywords, paper, poster, video }: Card =
        rows[Number(project)];
      // @ts-expect-error it exists
      c.state.catalog.push(
        createCard(year, title, authors, abstract, keywords, paper, poster, video, Number(project))
      );
    } else {
      rows.forEach(
        ({ year, title, authors, abstract, keywords, paper, poster, video }: Card, i: number) => {
          // @ts-expect-error it exists
          c.state.catalog.push(
            createCard(year, title, authors, abstract, keywords, paper, poster, video, i)
          );
        }
      );
    }

    const el = document.querySelector('#app');
    c.mount(el as HTMLElement);
    if (project) {
      ((el?.childNodes[1] as HTMLElement).firstElementChild as HTMLElement).setAttribute(
        'open',
        ''
      );
      const button = document.createElement('button');
      button.textContent = '🔙 Go Back Home';
      button.onclick = () => {
        window.location.replace(window.location.origin);
      };
      (el?.childNodes[0] as HTMLElement).replaceWith(button);
    }
  });
