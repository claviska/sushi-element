import { createElement, html } from '../../dist/index.js';

export const FormatBytes = createElement({
  tagName: 'my-format-bytes',
  props: {
    value: 0,
    unit: 'bytes', // 'bits' | 'bytes'.
    locale: undefined
  },
  render() {
    const bytes = formatBytes(this.value, { unit: this.unit, locale: this.locale });
    return html`${bytes}`;
  }
});

function formatBytes(bytes, options) {
  options = Object.assign({ unit: 'bytes', locale: undefined }, options);

  const byteUnits = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const bitUnits = ['b', 'kbit', 'Mbit', 'Gbit', 'Tbit', 'Pbit', 'Ebit', 'Zbit', 'Ybit'];
  const units = options.unit === 'bytes' ? byteUnits : bitUnits;
  const isNegative = bytes < 0;

  bytes = Math.abs(bytes);
  if (bytes === 0) return '0 B';

  const i = Math.min(Math.floor(Math.log10(bytes) / 3), units.length - 1);
  const num = Number((bytes / Math.pow(1000, i)).toPrecision(3));
  const numString = num.toLocaleString(options.locale);
  const prefix = isNegative ? '-' : '';

  return `${prefix}${numString} ${units[i]}`;
}
