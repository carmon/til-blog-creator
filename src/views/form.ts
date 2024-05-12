// TS -> HTML

import { BUTTON, DEFAULTS, DIV, H1, INPUT } from './styles';

export default (
    code: string,
) => {
    return `
        <head>
            <title>til-blog-creator</title>
            <script>
                const createBlog = () => {
                    const name = document.getElementById("name").value;
                    let base = '';
                    if (window.location.host !== 'localhost:8000') base += '/api';
                    window.location = base + '/create?code=${code}&name=' + name.replaceAll(' ', '-');
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
                <label for="name">Repository name</label>
                <input id="name" autocomplete="off" type="text" />
                <span>Blank spaces will be converted to middle lines.</span>
                <button onclick="createBlog()">Create your blog!</button>
            </div>
        </body>
    `;
};