// TS -> HTML

import { BUTTON, DEFAULTS, DIV, H1, INPUT } from './styles.js';

export default (
    code: string,
) => {
    return `
        <head>
            <title>til-blog-creator</title>
            <script>
                const createBlog = () => {
                    const endpoint = (window.location.host !== 'localhost:8000' ? '/api' : '') + '/create?';
                    const name = document.getElementById("name").value?.replaceAll(' ', '-');
                    const title = document.getElementById("title").value;
                    if (!name || !title) return;
                    window.location = endpoint + 'code=${code}&name=' + name + '&title=' + title;
                }
            </script>
            <style>
                ${DEFAULTS}
                ${DIV}
                ${H1}
                label {
                    margin-top: 10px;
                    color: rgb(40, 13, 95);
                    font-size: 13px;
                    font-weight: bold;
                }
                ${INPUT}
                ${BUTTON}
            </style>
        </head>
        <body>
            <div>
                <h1>til-blog-creator</h1>
                <h3>Repository config</h3>
                <label for="name">Name</label>
                <input id="name" autocomplete="off" type="text" />
                <span>*Blank spaces will be converted to middle lines.</span>
                <label for="name">Title</label>
                <input id="title" autocomplete="off" type="text" />
                <button onclick="createBlog()">Create your blog!</button>
            </div>
        </body>
    `;
};