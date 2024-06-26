import {Prism, themes} from 'prism-react-renderer';

globalThis.Prism = Prism;

require('prismjs/components/prism-ini.min');
require('prismjs/components/prism-vim.min');
require('prismjs/components/prism-ruby.min');
require('prismjs/components/prism-yaml.min');
require('prismjs/components/prism-bash.min');

Prism.languages['vim.map'] = {
    keyword: /\b[nivox]?(?:nore)?map\b/,
    string: /<[\w-]+>/i,
};

Prism.languages.bash['function-name'].push({
    pattern: /(?:^|\| |&& |;\s*(?:or|and) )\s*([\w.]\S*)/g,
    alias: 'function',
});

Prism.languages.vim.punctuation = /[{}[\](),;:\\]/;
Prism.languages.vim.number =
    /(?:\b(?:0x[\da-f]+|\d+(?:\.\d+)?)\b)|#[\da-f]{3}(?:[\da-f]{3})?/i;
Prism.languages.vim.keyword =
    /\b(?:let|if|hi|au|augroup|fun|abbreviate|abclear|aboveleft|argdo|args|argument|ascii|badd|ball|bdelete|belowright|bfirst|blast|bmodified|bnext|botright|bprevious|brea|break|breaka|breakadd|breakd|breakdel|breakl|breaklist|brewind|browse|bufdo|buffer|buffers|bunload|bwipeout|cabbrev|cabc|cabclear|caddb|caddbuffer|caddexpr|caddf|caddfile|call|catch|cbuffer|cclose|center|cexpr|cfile|cfir|cfirst|cgetb|cgetbuffer|cgete|cgetexpr|cgetfile|change|changes|chdir|checkpath|checkt|checktime|clast|clist|close|cmapc|cmapclear|cnew|cnewer|cnext|cnfile|cnorea|cnoreabbrev|colder|colo|comc|comclear|comp|compiler|conf|confirm|continue|cope|copen|copy|cpfile|cprevious|cquit|crewind|cuna|cunabbrev|cunmap|cwindow|debugg|debuggreedy|delc|delcommand|delete|delf|delfunction|delm|delmarks|diffg|diffget|diffoff|diffpatch|diffpu|diffput|diffsplit|diffthis|diffu|diffupdate|digraphs|display|djump|dlist|drop|dsearch|dsplit|earlier|echoe|echoerr|echom|echomsg|echon|edit|else|elsei|elseif|emenu|endf|endfo|endfor|endfun|endfunction|endif|endt|endtry|endw|endwhile|enew|exit|exusage|file|files|filetype|fina|finally|find|fini|finish|first|fixdel|fold|foldc|foldclose|foldd|folddoc|folddoclosed|folddoopen|foldo|foldopen|function|goto|grep|grepa|grepadd|hardcopy|help|helpf|helpfind|helpg|helpgrep|helpt|helptags|hide|history|iabbrev|iabc|iabclear|ijump|ilist|imapc|imapclear|inorea|inoreabbrev|isearch|isplit|iuna|iunabbrev|iunmap|join|jumps|keepalt|keepj|keepjumps|keepmarks|laddb|laddbuffer|laddexpr|laddf|laddfile|language|last|later|lbuffer|lchdir|lclose|lefta|leftabove|lexpr|lfile|lfir|lfirst|lgetb|lgetbuffer|lgete|lgetexpr|lgetfile|lgrep|lgrepa|lgrepadd|lhelpgrep|list|llast|llist|lmak|lmake|lmap|lmapc|lmapclear|lnew|lnewer|lnext|lnfile|lnoremap|loadview|lockmarks|lockv|lockvar|lolder|lopen|lpfile|lprevious|lrewind|ltag|lunmap|lvimgrep|lvimgrepa|lvimgrepadd|lwindow|make|mark|marks|match|menut|menutranslate|mkexrc|mksession|mksp|mkspell|mkvie|mkview|mkvimrc|mode|move|mzfile|mzscheme|nbkey|next|nmapc|nmapclear|nohlsearch|norea|noreabbrev|number|nunmap|omapc|omapclear|only|open|options|ounmap|pclose|pedit|perl|perld|perldo|popu|popup|ppop|preserve|prev|previous|print|prof|profd|profdel|profile|promptf|promptfind|promptr|promptrepl|psearch|ptag|ptfirst|ptjump|ptlast|ptnext|ptprevious|ptrewind|ptselect|pwd|pyfile|python|qall|quit|quita|quitall|read|recover|redi|redir|redo|redr|redraw|redraws|redrawstatus|registers|resize|retab|retu|return|rewind|rightb|rightbelow|ruby|rubyd|rubydo|rubyf|rubyfile|runtime|rviminfo|sall|sandbox|sargument|saveas|sball|sbfirst|sblast|sbmodified|sbnext|sbprevious|sbrewind|sbuffer|scrip|scripte|scriptencoding|scriptnames|setf|setfiletype|setg|setglobal|setl|setlocal|sfind|sfir|sfirst|shell|sign|silent|simalt|slast|sleep|smagic|smap|smapc|smapclear|smenu|snext|sniff|snomagic|snor|snoremap|snoreme|snoremenu|sort|source|spelld|spelldump|spellgood|spelli|spellinfo|spellr|spellrepall|spellu|spellundo|spellw|spellwrong|split|sprevious|srewind|stag|star|startg|startgreplace|startinsert|startr|startreplace|stjump|stop|stopi|stopinsert|stselect|sunhide|sunm|sunmap|suspend|sview|syncbind|tabc|tabclose|tabd|tabdo|tabe|tabedit|tabf|tabfind|tabfir|tabfirst|tabl|tablast|tabm|tabmove|tabn|tabnew|tabnext|tabo|tabonly|tabp|tabprevious|tabr|tabrewind|tabs|tags|tcld|tcldo|tclf|tclfile|tearoff|tfirst|throw|tjump|tlast|tmenu|tnext|topleft|tprevious|trewind|tselect|tunmenu|unabbreviate|undo|undoj|undojoin|undol|undolist|unhide|unlet|unlo|unlockvar|unmap|update|verb|verbose|version|vert|vertical|view|vimgrep|vimgrepa|vimgrepadd|viusage|vmapc|vmapclear|vnew|vsplit|vunmap|wall|while|winc|wincmd|windo|winp|winpos|winsize|wnext|wprevious|wqall|write|wsverb|wviminfo|xall|xmap|xmapc|xmapclear|xmenu|xnoremap|xnoreme|xnoremenu|xunmap|yank)\b/;
Prism.languages.vim.string = {
    pattern: /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\r\n]|'')*'/,
    inside: {
        interpolation: {
            pattern: /((?:^|[^\\])(?:\\{2})*)%\{(?:[^{}]|\{[^{}]*\})*\}/,
            lookbehind: true,
            inside: {
                content: {
                    pattern: /^(%\{)[\s\S]+(\})$/,
                    lookbehind: true,
                    inside: Prism.languages.vim,
                },
                delimiter: {
                    pattern: /^%\{|\}$/,
                    alias: 'punctuation',
                },
            },
        },
    },
};

function extract(theme) {
    const result = {plain: theme.plain};

    for (const {types, style} of theme.styles) {
        for (const type of types) {
            if (result[type]) {
                Object.assign(result[type], style);
            } else {
                result[type] = structuredClone(style);
            }
        }
    }

    return result;
}

function group(a, b) {
    return Object.keys(a)
        .concat(Object.keys(b))
        .reduce((acc, key) => {
            const aProps = a[key] ?? {};
            const bProps = b[key] ?? {};

            acc[key] = Object.keys(aProps)
                .concat(Object.keys(bProps))
                .reduce((acc, key) => {
                    acc[key] = [aProps[key] ?? null, bProps[key] ?? null];

                    return acc;
                }, {});

            return acc;
        }, {});
}

const dark = extract(themes.oneDark);
const light = extract(themes.github);
const result = Object.entries(group(dark, light)).reduce(
    (acc, [type, rules]) => {
        const style = {};

        for (const [prop, [dark, light]] of Object.entries(rules)) {
            const key = `--prism-${type}-${prop}`;

            if (dark !== null) acc.defs.dark.set(key, dark);
            if (light !== null) acc.defs.light.set(key, light);

            style[prop] = `var(${key})`;
        }

        if (type === 'plain') {
            acc.theme[type] = style;
        } else {
            acc.theme.styles.push({types: [type], style});
        }

        return acc;
    },
    {
        theme: {plain: {}, styles: []},
        defs: {dark: new Map(), light: new Map()},
    },
);

export const theme = result.theme;
export const darkStyles = Array.from(result.defs.dark.entries())
    .map(([prop, value]) => `${prop}: ${value};`)
    .join('');
export const lightStyles = Array.from(result.defs.light.entries())
    .map(([prop, value]) => `${prop}: ${value};`)
    .join('');
export const prismStyles = `html.light { ${lightStyles} }\nhtml.dark { ${darkStyles} }`;
