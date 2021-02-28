import translations from '@data/translation.json';

export default function t(keyPath) {
    return keyPath.split('.').reduce((keys, key) => keys[key], translations);
}
