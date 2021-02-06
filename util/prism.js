import Prism from 'prism-react-renderer/prism';

(global || window).Prism = Prism;

require('prismjs/components/prism-vim');
require('prismjs/components/prism-ruby');
require('prismjs/components/prism-yaml');

Prism.languages.vim.number = /(?:\b(?:0x[\da-f]+|\d+(?:\.\d+)?)\b)|#[\da-f]+/i;
Prism.languages.viml = Prism.languages.vim;
