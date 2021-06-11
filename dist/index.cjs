'use strict';

var fs$4 = require('fs/promises');
var require$$0 = require('fs');
var path$4 = require('path');
var url = require('url');
var module$1 = require('module');
var require$$1 = require('os');
var require$$0$1 = require('util');
var require$$4 = require('events');
var require$$6 = require('assert');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs$4);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path$4);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
var require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);
var require$$6__default = /*#__PURE__*/_interopDefaultLegacy(require$$6);

/**
 * Takes any input and guarantees an array back.
 *
 * - Converts array-like objects (e.g. `arguments`, `Set`) to a real array.
 * - Converts `undefined` to an empty array.
 * - Converts any another other, singular value (including `null`, objects and iterables other than `Set`) into an array containing that value.
 * - Ignores input which is already an array.
 *
 * @module array-back
 * @example
 * > const arrayify = require('array-back')
 *
 * > arrayify(undefined)
 * []
 *
 * > arrayify(null)
 * [ null ]
 *
 * > arrayify(0)
 * [ 0 ]
 *
 * > arrayify([ 1, 2 ])
 * [ 1, 2 ]
 *
 * > arrayify(new Set([ 1, 2 ]))
 * [ 1, 2 ]
 *
 * > function f(){ return arrayify(arguments); }
 * > f(1,2,3)
 * [ 1, 2, 3 ]
 */

function isObject (input) {
  return typeof input === 'object' && input !== null
}

function isArrayLike (input) {
  return isObject(input) && typeof input.length === 'number'
}

/**
 * @param {*} - The input value to convert to an array
 * @returns {Array}
 * @alias module:array-back
 */
function arrayify (input) {
  if (Array.isArray(input)) {
    return input
  } else if (input === undefined) {
    return []
  } else if (isArrayLike(input) || input instanceof Set) {
    return Array.from(input)
  } else {
    return [input]
  }
}

/**
 * Isomorphic, functional type-checking for Javascript.
 * @module typical
 * @typicalname t
 * @example
 * const t = require('typical')
 * const allDefined = array.every(t.isDefined)
 */

/**
 * Returns true if the input value is an ES2015 `class`.
 * @param {*} - the input to test
 * @returns {boolean}
 * @static
 */
function isClass (input) {
  if (typeof input === 'function') {
    return /^class /.test(Function.prototype.toString.call(input))
  } else {
    return false
  }
}

const require$1 = module$1.createRequire((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href)));


/**
 * @param {string} - A valid Node.js module specifier.
 */
async function loadModuleSpecifier (specifier) {
  if (typeof specifier !== 'string') {
    throw new Error('specifier expected')
  }
  try {
    const mod = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(specifier)); });
    return mod.default
  } catch (err) {
    if (['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND'].includes(err.code)) {
      return null
    } else {
      throw err
    }
  }
}

/**
 * @param {string} - A valid Node.js module specifier.
 * @param {string|string[]} - One or more additional directories from which to resolve the supplied specifier from.
 */
async function loadModuleResolvedFrom (specifier, paths) {
  if (!(specifier && paths && paths.length)) {
    throw new Error('specifier and paths expected')
  }
  try {
    specifier = require$1.resolve(specifier, { paths: arrayify(paths) });
    return loadModuleSpecifier(url.pathToFileURL(specifier).href)
  } catch (err) {
    if (['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND'].includes(err.code)) {
      return null
    } else {
      throw err
    }
  }
}

/**
 * @param {string} - A valid module path.
 * @param {string|string[]} - One or more additional directories in which to search for the supplied module path.
 */
async function loadModuleRelativeTo (specifier, paths) {
  if (!(specifier && paths && paths.length)) {
    throw new Error('specifier and paths expected')
  }
  let output = null;
  for (const p of arrayify(paths)) {
    output = await loadModuleSpecifier(url.pathToFileURL(path__default['default'].resolve(p, specifier)).href);
    if (output) break
  }
  return output
}

class FindReplace {
  description () {
    return 'Find and replace strings and regular expressions.'
  }

  optionDefinitions () {
    return [
      {
        name: 'find',
        alias: 'f',
        type: String,
        description: 'Optional find string (e.g. `one`) or regular expression literal (e.g. `/one/i`). If omitted, the whole filename will be matched and replaced.'
      },
      {
        name: 'replace',
        alias: 'r',
        type: String,
        defaultValue: '',
        description: 'The replace string. If omitted, defaults to an empty string.'
      },
      {
        name: 'path-element',
        alias: 'e',
        description: 'The path element to rename, valid values are `base` (the default), `name` and `ext`. For example, in the path `pics/image.jpg`, the base is `image.jpg`, the name is `image` and the ext is `.jpg`.'
      }
    ]
  }

  replace (filePath, options = {}) {
    let { find, replace } = options;
    if (find || replace) {
      const file = path__default['default'].parse(filePath);
      find = find || file.base;
      const element = options.pathElement || 'base';
      if (element === 'base') {
        const basename = file.base.replace(find, replace);
        if (basename) {
          return path__default['default'].join(file.dir, basename)
        } else {
          throw new Error(`Replace resulted in empty filename. File: ${filePath}, find: ${find}, replace: ${replace}`)
        }
      } else if (['name', 'ext'].includes(element)) {
        file[element] = file[element].replace(find, replace);
        const basename = file.name + file.ext;
        if (basename) {
          return path__default['default'].join(file.dir, basename)
        } else {
          throw new Error(`Replace resulted in empty filename. File: ${filePath}, find: ${find}, replace: ${replace}`)
        }
      } else {
        throw new Error('Invalid path element: ' + element)
      }
    } else {
      throw new Error('Please specify a value for `find` and/or `replace`')
    }
  }
}

/* printj.js (C) 2016-present SheetJS -- http://sheetjs.com */

function tokenize(fmt/*:string*/)/*:ParsedFmt*/ {
	var out/*:ParsedFmt*/ = [];
	var start/*:number*/ = 0;

	var i/*:number*/ = 0;
	var infmt/*:boolean*/ = false;
	var fmtparam/*:string*/ = "", fmtflags/*:string*/ = "", fmtwidth/*:string*/ = "", fmtprec/*:string*/ = "", fmtlen/*:string*/ = "";

	var c/*:number*/ = 0;

	var L/*:number*/ = fmt.length;

	for(; i < L; ++i) {
		c = fmt.charCodeAt(i);
		if(!infmt) {

			if(c !== 37) continue;

			if(start < i) out.push(["L", fmt.substring(start, i)]);
			start = i;
			infmt = true;
			continue;
		}

		if(c >= 48 && c < 58)	{
				if(fmtprec.length) fmtprec += String.fromCharCode(c);
				else if(c == 48 && !fmtwidth.length) fmtflags += String.fromCharCode(c);
				else fmtwidth += String.fromCharCode(c);
		} else switch(c) {
			/* positional */
			case 36:
				if(fmtprec.length) fmtprec += "$";
				else if(fmtwidth.charAt(0) == "*") fmtwidth += "$";
				else { fmtparam = fmtwidth + "$"; fmtwidth = ""; }
				break;

			/* flags */
			case 39: fmtflags += "'"; break;
			case 45: fmtflags += "-"; break;
			case 43: fmtflags += "+"; break;
			case 32: fmtflags += " "; break;
			case 35: fmtflags += "#"; break;

			/* width and precision */
			case 46: fmtprec = "."; break;
			case 42:
				if(fmtprec.charAt(0) == ".") fmtprec += "*";
				else fmtwidth += "*";
				break;

			/* length */
			case 104:
			case 108:
				if(fmtlen.length > 1) throw "bad length " + fmtlen + String(c);
				fmtlen += String.fromCharCode(c);
				break;

			case  76:
			case 106:
			case 122:
			case 116:
			case 113:
			case  90:
			case 119:
				if(fmtlen !== "") throw "bad length " + fmtlen + String.fromCharCode(c);
				fmtlen = String.fromCharCode(c);
				break;

			case 73:
				if(fmtlen !== "") throw "bad length " + fmtlen + 'I';
				fmtlen = 'I';
				break;

			/* conversion */
			case 100:
			case 105:
			case 111:
			case 117:
			case 120:
			case 88:
			case 102:
			case 70:
			case 101:
			case 69:
			case 103:
			case 71:
			case 97:
			case 65:
			case 99:
			case 67:
			case 115:
			case 83:
			case 112:
			case 110:
			case 68:
			case 85:
			case 79:
			case 109:
			case 98:
			case 66:
			case 121:
			case 89:
			case 74:
			case 86:
			case 84:
			case 37:
				infmt = false;
				if(fmtprec.length > 1) fmtprec = fmtprec.substr(1);
				out.push([String.fromCharCode(c), fmt.substring(start, i+1), fmtparam, fmtflags, fmtwidth, fmtprec, fmtlen]);
				start = i+1;
				fmtlen = fmtprec = fmtwidth = fmtflags = fmtparam = "";
				break;
			default:
				throw new Error("Invalid format string starting with |" + fmt.substring(start, i+1) + "|");
		}

	}

	if(start < fmt.length) out.push(["L", fmt.substring(start)]);
	return out;
}

var u_inspect/*:(o:any)=>string*/ = JSON.stringify;

function doit(t/*:ParsedFmt*/, args/*:Array<any>*/)/*:string*/ {
	var o/*:Array<string>*/ = [];
	var argidx/*:number*/ = 0, idx/*:number*/ = 0;
	var Vnum/*:number*/ = 0;
	var pad/*:string*/ = "";
	for(var i/*:number*/ = 0; i < t.length; ++i) {
		var m/*:ParsedEntry*/ = t[i], c/*:number*/ = (m[0]/*:string*/).charCodeAt(0);
		/* m order: conv full param flags width prec length */

		if(c === /*L*/ 76) { o.push(m[1]); continue; }
		if(c === /*%*/ 37) { o.push("%"); continue; }

		var O/*:string*/ = "";
		var isnum/*:number*/ = 0, radix/*:number*/ = 10, bytes/*:number*/ = 4, sign/*:boolean*/ = false;

		/* flags */
		var flags/*:string*/ = m[3]||"";
		var alt/*:boolean*/ = flags.indexOf("#") > -1;

		/* position */
		if(m[2]) argidx = parseInt(m[2])-1;
		/* %m special case */
		else if(c === /*m*/ 109 && !alt) { o.push("Success"); continue; }

		/* grab width */
		var width =  0; if(m[ 4] != null && m[ 4].length > 0) { if(m[ 4].charAt(0) !== '*') width = parseInt(m[ 4], 10); else if(m[ 4].length === 1) width = args[idx++]; else width = args[parseInt(m[ 4].substr(1), 10)-1]; }

		/* grab precision */
		var prec =  -1; if(m[ 5] != null && m[ 5].length > 0) { if(m[ 5].charAt(0) !== '*') prec = parseInt(m[ 5], 10); else if(m[ 5].length === 1) prec = args[idx++]; else prec = args[parseInt(m[ 5].substr(1), 10)-1]; }

		/* position not specified */
		if(!m[2]) argidx = idx++;

		/* grab argument */
		var arg/*:any*/ = args[argidx];

		/* grab length */
		var len/*:string*/ = m[6] || "";

		switch(c) {
			/* str cCsS */

			case /*S*/  83:
			case /*s*/ 115:
				/* only valid flag is "-" for left justification */
				O = String(arg);
				if( prec >= 0) O = O.substr(0,  prec);
				if( width > O.length || - width > O.length) { if(( flags.indexOf("-") == -1 ||  width < 0) &&  flags.indexOf("0") != -1) { pad = ( width - O.length >= 0 ? "0".repeat( width - O.length) : ""); O = pad + O; } else { pad = ( width - O.length >= 0 ? " ".repeat( width - O.length) : ""); O =  flags.indexOf("-") > -1 ? O + pad : pad + O; } }
				break;

			/* first char of string or convert */
			case /*C*/  67:
			case /*c*/  99:
				switch(typeof arg) {
					case "number":
						var cc/*:number*/ = arg;
						if(c == 67 || len.charCodeAt(0) === /*l*/ 108) {  cc &= 0xFFFFFFFF; O = String.fromCharCode( cc); }
						else {  cc &= 0xFF; O = String.fromCharCode( cc); }
						break;
					case "string": O = /*::(*/arg/*:: :string)*/.charAt(0); break;
					default: O = String(arg).charAt(0);
				}
				if( width > O.length || - width > O.length) { if(( flags.indexOf("-") == -1 ||  width < 0) &&  flags.indexOf("0") != -1) { pad = ( width - O.length >= 0 ? "0".repeat( width - O.length) : ""); O = pad + O; } else { pad = ( width - O.length >= 0 ? " ".repeat( width - O.length) : ""); O =  flags.indexOf("-") > -1 ? O + pad : pad + O; } }
				break;

			/* int diDuUoOxXbB */

			/* signed integer */
			case /*D*/  68: bytes = 8;
			/* falls through */
			case /*d*/ 100:
			case /*i*/ 105: isnum = -1; sign = true; break;

			/* unsigned integer */
			case /*U*/  85: bytes = 8;
			/* falls through */
			case /*u*/ 117: isnum = -1; break;

			/* unsigned octal */
			case /*O*/  79: bytes = 8;
			/* falls through */
			case /*o*/ 111: isnum = -1; radix = (8); break;

			/* unsigned hex */
			case /*x*/ 120: isnum = -1; radix = (-16); break;
			case /*X*/  88: isnum = -1; radix = (16); break;

			/* unsigned binary (extension) */
			case /*B*/  66: bytes = 8;
			/* falls through */
			case /*b*/  98: isnum = -1; radix = (2); break;

			/* flt fegFEGaA */

			/* floating point logic */
			case /*F*/  70:
			case /*f*/ 102: isnum = (1); break;

			case /*E*/  69:
			case /*e*/ 101: isnum = (2); break;

			case /*G*/  71:
			case /*g*/ 103: isnum = (3); break;

			/* floating hex */
			case /*A*/  65:
			case /*a*/  97: isnum = (4); break;

			/* misc pnmJVTyY */

			/* JS has no concept of pointers so interpret the `l` key as an address */
			case /*p*/ 112:
				Vnum = typeof arg == "number" ? arg : arg ? Number(arg.l) : -1;
				if(isNaN(Vnum)) Vnum = -1;
				if(alt) O = Vnum.toString(10);
				else {
					Vnum = Math.abs(Vnum);
					O = "0x" + Vnum.toString(16).toLowerCase();
				}
				break;

			/* store length in the `len` key */
			case /*n*/ 110:
				if(arg) { arg.len=0; for(var oo/*:number*/ = 0; oo < o.length; ++oo) arg.len += o[oo].length; }
				continue;

			/* process error */
			case /*m*/ 109:
				if(!(arg instanceof Error)) O = "Success";
				else if(arg.message) O = arg.message;
				else if(arg.errno) O = "Error number " + arg.errno;
				else O = "Error " + String(arg);
				break;

			/* JS-specific conversions (extension) */
			case /*J*/  74: O = (alt ? u_inspect : JSON.stringify)(arg); break;
			case /*V*/  86: O = arg == null ? "null" : String(arg.valueOf()); break;
			case /*T*/  84:
				if(alt) { /* from '[object %s]' extract %s */
					O = Object.prototype.toString.call(arg).substr(8);
					O = O.substr(0, O.length - 1);
				} else O = typeof arg;
				break;

			/* boolean (extension) */
			case /*Y*/  89:
			case /*y*/ 121:
				O = (arg) ? (alt ? "yes" : "true") : (alt ? "no" : "false");
				if(c == /*Y*/ 89) O = O.toUpperCase();
				if( prec >= 0) O = O.substr(0,  prec);
				if( width > O.length || - width > O.length) { if(( flags.indexOf("-") == -1 ||  width < 0) &&  flags.indexOf("0") != -1) { pad = ( width - O.length >= 0 ? "0".repeat( width - O.length) : ""); O = pad + O; } else { pad = ( width - O.length >= 0 ? " ".repeat( width - O.length) : ""); O =  flags.indexOf("-") > -1 ? O + pad : pad + O; } }
				break;

		}

		if(width < 0) { width = -width; flags += "-"; }

		if(isnum == -1) {

			Vnum = Number(arg);

			/* parse byte length field */

			switch(len) {
				/* char */
				case "hh": { bytes = 1; } break;
				/* short */
				case "h":  { bytes = 2; } break;

				/* long */
				case "l":  { if(bytes == 4) bytes = 8; } break;

				/* long long */
				case "L":
				case "q":
				case "ll": { if(bytes == 4) bytes = 8; } break;

				/* intmax_t */
				case "j":  { if(bytes == 4) bytes = 8; } break;

				/* ptrdiff_t */
				case "t":  { if(bytes == 4) bytes = 8; } break;

				/* size_t */
				case "z":
				case "Z":  { if(bytes == 4) bytes = 8; } break;

				/* CRT size_t or ptrdiff_t */
				case "I":

					{ if(bytes == 4) bytes = 8; }

					break;
			}

			/* restrict value */

			switch(bytes) {
				case 1: Vnum = (Vnum & 0xFF); if(sign && (Vnum >  0x7F)) Vnum -= (0xFF + 1); break;
				case 2: Vnum = (Vnum & 0xFFFF); if(sign && (Vnum >  0x7FFF)) Vnum -= (0xFFFF + 1); break;
				case 4: Vnum = sign ? (Vnum | 0) : (Vnum >>> 0); break;
				default: Vnum = isNaN(Vnum) ? 0 : Math.round(Vnum); break;
			}

			/* generate string */
			if(bytes > 4 && Vnum < 0 && !sign) {
				if(radix == 16 || radix == -16) {
					O = (Vnum>>>0).toString(16);
					Vnum = Math.floor((Vnum - (Vnum >>> 0)) / Math.pow(2,32));
					O = (Vnum>>>0).toString(16) + (8 - O.length >= 0 ?  "0".repeat(8 - O.length) : "") + O;
					O = (16 - O.length >= 0 ?  "f".repeat(16 - O.length) : "") + O;
					if(radix == 16) O = O.toUpperCase();
				} else if(radix == 8) {
					O = (Vnum>>>0).toString(8);
					O = (10 - O.length >= 0 ?  "0".repeat(10 - O.length) : "") + O;
					Vnum = Math.floor((Vnum - ((Vnum >>> 0)&0x3FFFFFFF)) / Math.pow(2,30));
					O = (Vnum>>>0).toString(8) + O.substr(O.length - 10);
					O = O.substr(O.length - 20);
					O = "1" + (21 - O.length >= 0 ?  "7".repeat(21 - O.length) : "") + O;
				} else {
					Vnum = (-Vnum) % 1e16;
					var d1/*:Array<number>*/ = [1,8,4,4,6,7,4,4,0,7,3,7,0,9,5,5,1,6,1,6];
					var di/*:number*/ = d1.length - 1;
					while(Vnum > 0) {
						if((d1[di] -= (Vnum % 10)) < 0) { d1[di] += 10; d1[di-1]--; }
						--di; Vnum = Math.floor(Vnum / 10);
					}
					O = d1.join("");
				}
			} else {
				if(radix === -16) O = Vnum.toString(16).toLowerCase();
				else if(radix === 16) O = Vnum.toString(16).toUpperCase();
				else O = Vnum.toString(radix);
			}

			/* apply precision */
			if(prec ===0 && O == "0" && !(radix == 8 && alt)) O = ""; /* bail out */
			else {
				if(O.length < prec + (O.substr(0,1) == "-" ? 1 : 0)) {
					if(O.substr(0,1) != "-") O = (prec - O.length >= 0 ?  "0".repeat(prec - O.length) : "") + O;
					else O = O.substr(0,1) + (prec + 1 - O.length >= 0 ?  "0".repeat(prec + 1 - O.length) : "") + O.substr(1);
				}

				/* add prefix for # form */
				if(!sign && alt && Vnum !== 0) switch(radix) {
					case -16: O = "0x" + O; break;
					case  16: O = "0X" + O; break;
					case   8: if(O.charAt(0) != "0") O =  "0" + O; break;
					case   2: O = "0b" + O; break;
				}
			}

			/* add sign character */
			if(sign && O.charAt(0) != "-") {
				if(flags.indexOf("+") > -1) O = "+" + O;
				else if(flags.indexOf(" ") > -1) O = " " + O;
			}
			/* width */
			if(width > 0) {
				if(O.length < width) {
					if(flags.indexOf("-") > -1) {
						O = O + ((width - O.length) >= 0 ?  " ".repeat((width - O.length)) : "");
					} else if(flags.indexOf("0") > -1 && prec < 0 && O.length > 0) {
						if(prec > O.length) O = ((prec - O.length) >= 0 ?  "0".repeat((prec - O.length)) : "") + O;
						pad = ((width - O.length) >= 0 ?  (prec > 0 ? " " : "0").repeat((width - O.length)) : "");
						if(O.charCodeAt(0) < 48) {
							if(O.charAt(2).toLowerCase() == "x") O = O.substr(0,3) + pad + O.substring(3);
							else O = O.substr(0,1) + pad + O.substring(1);
						}
						else if(O.charAt(1).toLowerCase() == "x") O = O.substr(0,2) + pad + O.substring(2);
						else O = pad + O;
					} else {
						O = ((width - O.length) >= 0 ?  " ".repeat((width - O.length)) : "") + O;
					}
				}
			}

		} else if(isnum > 0) {

			Vnum = Number(arg);
			if(arg === null) Vnum = 0/0;
			if(len == "L") bytes = 12;
			var isf/*:boolean*/ = isFinite(Vnum);
			if(!isf) { /* Infinity or NaN */
				if(Vnum < 0) O = "-";
				else if(flags.indexOf("+") > -1) O = "+";
				else if(flags.indexOf(" ") > -1) O = " ";
				O += (isNaN(Vnum)) ? "nan" : "inf";
			} else {
				var E/*:number*/ = 0;

				if(prec == -1 && isnum != 4) prec = 6;

				/* g/G conditional behavior */
				if(isnum == 3) {
					O = Vnum.toExponential(1);
					E = +O.substr(O.indexOf("e") + 1);
					if(prec === 0) prec = 1;
					if(prec > E && E >= -4) { isnum = (11); prec = prec -(E + 1); }
					else { isnum = (12); prec = prec - 1; }
				}

				/* sign: workaround for negative zero */
				var sg/*:string*/ = (Vnum < 0 || 1/Vnum == -Infinity) ? "-" : "";
				if(Vnum < 0) Vnum = -Vnum;

				switch(isnum) {
					/* f/F standard */
					case 1: case 11:
						if(Vnum < 1e21) {
							O = Vnum.toFixed(prec);
							if(isnum == 1) { if(prec===0 &&alt&& O.indexOf(".")==-1) O+="."; }
							else if(!alt) O=O.replace(/(\.\d*[1-9])0*$/,"$1").replace(/\.0*$/,"");
							else if(O.indexOf(".") == -1) O+= ".";
							break;
						}
						O = Vnum.toExponential(20);
						E = +O.substr(O.indexOf("e")+1);
						O = O.charAt(0) + O.substr(2,O.indexOf("e")-2);
						O = O + (E - O.length + 1 >= 0 ?  "0".repeat(E - O.length + 1) : "");
						if(alt || (prec > 0 && isnum !== 11)) O = O + "." + (prec >= 0 ?  "0".repeat(prec) : "");
						break;

					/* e/E exponential */
					case 2: case 12:
						O = Vnum.toExponential(prec);
						E = O.indexOf("e");
						if(O.length - E === 3) O = O.substr(0, E+2) + "0" + O.substr(E+2);
						if(alt && O.indexOf(".") == -1) O = O.substr(0,E) +"."+ O.substr(E);
						else if(!alt && isnum == 12) O = O.replace(/\.0*e/, "e").replace(/\.(\d*[1-9])0*e/, ".$1e");
						break;

					/* a/A hex */
					case 4:
						if(Vnum===0){O= "0x0"+((alt||prec>0)?"."+(prec >= 0 ? "0".repeat(prec) : ""):"")+"p+0"; break;}
						O = Vnum.toString(16);
						/* First char 0-9 */
						var ac/*:number*/ = O.charCodeAt(0);
						if(ac == 48) {
							ac = 2; E = -4; Vnum *= 16;
							while(O.charCodeAt(ac++) == 48) { E -= 4; Vnum *= 16; }
							O = Vnum.toString(16);
							ac = O.charCodeAt(0);
						}

						var ai/*:number*/ = O.indexOf(".");
						if(O.indexOf("(") > -1) {
							/* IE exponential form */
							var am/*:?Array<any>*/ = O.match(/\(e(.*)\)/);
							var ae/*:number*/ = am ? (+am[1]) : 0;
							E += 4 * ae; Vnum /= Math.pow(16, ae);
						} else if(ai > 1) {
							E += 4 * (ai - 1); Vnum /= Math.pow(16, ai - 1);
						} else if(ai == -1) {
							E += 4 * (O.length - 1); Vnum /= Math.pow(16, O.length - 1);
						}

						/* at this point 1 <= Vnum < 16 */

						if(bytes > 8) {
							if(ac < 50) { E -= 3; Vnum *= 8; }
							else if(ac < 52) { E -= 2; Vnum *= 4; }
							else if(ac < 56) { E -= 1; Vnum *= 2; }
							/* at this point 8 <= Vnum < 16 */
						} else {
							if(ac >= 56) { E += 3; Vnum /= 8; }
							else if(ac >= 52) { E += 2; Vnum /= 4; }
							else if(ac >= 50) { E += 1; Vnum /= 2; }
							/* at this point 1 <= Vnum < 2 */
						}

						O = Vnum.toString(16);
						if(O.length > 1) {
							if(O.length > prec+2 && O.charCodeAt(prec+2) >= 56) {
								var _f/*:boolean*/ = O.charCodeAt(0) == 102;
								O = (Vnum + 8 * Math.pow(16, -prec-1)).toString(16);
								if(_f && O.charCodeAt(0) == 49) E += 4;
							}
							if(prec > 0) {
								O = O.substr(0, prec + 2);
								if(O.length < prec + 2) {
									if(O.charCodeAt(0) < 48) O = O.charAt(0) + ((prec + 2 - O.length) >= 0 ?  "0".repeat((prec + 2 - O.length)) : "") + O.substr(1);
									else O += ((prec + 2 - O.length) >= 0 ?  "0".repeat((prec + 2 - O.length)) : "");
								}
							} else if(prec === 0) O = O.charAt(0) + (alt ? "." : "");
						} else if(prec > 0) O = O + "." + (prec >= 0 ? "0".repeat(prec) : "");
						else if(alt) O = O + ".";
						O = "0x" + O + "p" + (E>=0 ? "+" + E : E);
						break;
				}

				if(sg === "") {
					if(flags.indexOf("+") > -1) sg = "+";
					else if(flags.indexOf(" ") > -1) sg = " ";
				}

				O = sg + O;
			}

			/* width */
			if(width > O.length) {
				if(flags.indexOf("-") > -1) {
					O = O + ((width - O.length) >= 0 ?  " ".repeat((width - O.length)) : "");
				} else if(flags.indexOf("0") > -1 && O.length > 0 && isf) {
					pad = ((width - O.length) >= 0 ?  "0".repeat((width - O.length)) : "");
					if(O.charCodeAt(0) < 48) {
						if(O.charAt(2).toLowerCase() == "x") O = O.substr(0,3) + pad + O.substring(3);
						else O = O.substr(0,1) + pad + O.substring(1);
					}
					else if(O.charAt(1).toLowerCase() == "x") O = O.substr(0,2) + pad + O.substring(2);
					else O = pad + O;
				} else {
					O = ((width - O.length) >= 0 ?  " ".repeat((width - O.length)) : "") + O;
				}
			}
			if(c < 96) O = O.toUpperCase();

		}

		o.push(O);
	}
	return o.join("");
}

function sprintf(/*:: ...argz*/)/*:string*/ {
	var args/*:Array<any>*/ = new Array(arguments.length - 1);
	for(var i/*:number*/ = 0; i < args.length; ++i) args[i] = arguments[i+1];
	return doit(tokenize(arguments[0]), args);
}

class IndexReplace {
  description () {
    return 'Replace the `\\{\\{index\\}\\}` token in a path with a number incremented for each file renamed.'
  }

  optionDefinitions () {
    return [
      { name: 'index-format', description: 'The format of the number to replace `\\{\\{index\\}\\}` with. Specify a standard printf format string, for example `%03d` would yield 001, 002, 003 etc. Defaults to `%d`.' },
      { name: 'index-root', description: 'The initial value for `\\{\\{index\\}\\}`. Defaults to 1.' }
    ]
  }

  /* Number to use in place of {{index}}. */
  calculateMatchCount (indexRoot) {
    if (this.matchCount || this.matchCount === 0) {
      return this.matchCount
    } else if (indexRoot || indexRoot === 0) {
      return indexRoot
    } else {
      return 1
    }
  }

  replace (filePath, options) {
    if (/{{index}}/.test(filePath)) {
      this.matchCount = this.calculateMatchCount(options.indexRoot);
      const file = path__default['default'].parse(filePath);
      const newBasename = this.replaceIndexToken(file.base, this.matchCount++, options.indexFormat || '%d');
      return path__default['default'].join(file.dir, newBasename)
    } else {
      return filePath
    }
  }

  replaceIndexToken (basename, index, format) {
    return basename.replace(/{{index}}/g, sprintf(format, index))
  }
}

function getModulePaths (fileURL) {
  const __filename = url.fileURLToPath(fileURL);
  const __dirname = path__default['default'].dirname(__filename);
  return { __filename, __dirname }
}

var globalDirs = {};

const { hasOwnProperty } = Object.prototype;

const eol = typeof process !== 'undefined' &&
  process.platform === 'win32' ? '\r\n' : '\n';

const encode = (obj, opt) => {
  const children = [];
  let out = '';

  if (typeof opt === 'string') {
    opt = {
      section: opt,
      whitespace: false,
    };
  } else {
    opt = opt || Object.create(null);
    opt.whitespace = opt.whitespace === true;
  }

  const separator = opt.whitespace ? ' = ' : '=';

  for (const k of Object.keys(obj)) {
    const val = obj[k];
    if (val && Array.isArray(val)) {
      for (const item of val)
        out += safe(k + '[]') + separator + safe(item) + '\n';
    } else if (val && typeof val === 'object')
      children.push(k);
    else
      out += safe(k) + separator + safe(val) + eol;
  }

  if (opt.section && out.length)
    out = '[' + safe(opt.section) + ']' + eol + out;

  for (const k of children) {
    const nk = dotSplit(k).join('\\.');
    const section = (opt.section ? opt.section + '.' : '') + nk;
    const { whitespace } = opt;
    const child = encode(obj[k], {
      section,
      whitespace,
    });
    if (out.length && child.length)
      out += eol;

    out += child;
  }

  return out
};

const dotSplit = str =>
  str.replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
    .replace(/\\\./g, '\u0001')
    .split(/\./)
    .map(part =>
      part.replace(/\1/g, '\\.')
        .replace(/\2LITERAL\\1LITERAL\2/g, '\u0001'));

const decode = str => {
  const out = Object.create(null);
  let p = out;
  let section = null;
  //          section     |key      = value
  const re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i;
  const lines = str.split(/[\r\n]+/g);

  for (const line of lines) {
    if (!line || line.match(/^\s*[;#]/))
      continue
    const match = line.match(re);
    if (!match)
      continue
    if (match[1] !== undefined) {
      section = unsafe(match[1]);
      if (section === '__proto__') {
        // not allowed
        // keep parsing the section, but don't attach it.
        p = Object.create(null);
        continue
      }
      p = out[section] = out[section] || Object.create(null);
      continue
    }
    const keyRaw = unsafe(match[2]);
    const isArray = keyRaw.length > 2 && keyRaw.slice(-2) === '[]';
    const key = isArray ? keyRaw.slice(0, -2) : keyRaw;
    if (key === '__proto__')
      continue
    const valueRaw = match[3] ? unsafe(match[4]) : true;
    const value = valueRaw === 'true' ||
      valueRaw === 'false' ||
      valueRaw === 'null' ? JSON.parse(valueRaw)
      : valueRaw;

    // Convert keys with '[]' suffix to an array
    if (isArray) {
      if (!hasOwnProperty.call(p, key))
        p[key] = [];
      else if (!Array.isArray(p[key]))
        p[key] = [p[key]];
    }

    // safeguard against resetting a previously defined
    // array by accidentally forgetting the brackets
    if (Array.isArray(p[key]))
      p[key].push(value);
    else
      p[key] = value;
  }

  // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
  // use a filter to return the keys that have to be deleted.
  const remove = [];
  for (const k of Object.keys(out)) {
    if (!hasOwnProperty.call(out, k) ||
        typeof out[k] !== 'object' ||
        Array.isArray(out[k]))
      continue

    // see if the parent section is also an object.
    // if so, add it to that, and mark this one for deletion
    const parts = dotSplit(k);
    let p = out;
    const l = parts.pop();
    const nl = l.replace(/\\\./g, '.');
    for (const part of parts) {
      if (part === '__proto__')
        continue
      if (!hasOwnProperty.call(p, part) || typeof p[part] !== 'object')
        p[part] = Object.create(null);
      p = p[part];
    }
    if (p === out && nl === l)
      continue

    p[nl] = out[k];
    remove.push(k);
  }
  for (const del of remove)
    delete out[del];

  return out
};

const isQuoted = val =>
  (val.charAt(0) === '"' && val.slice(-1) === '"') ||
    (val.charAt(0) === "'" && val.slice(-1) === "'");

const safe = val =>
  (typeof val !== 'string' ||
    val.match(/[=\r\n]/) ||
    val.match(/^\[/) ||
    (val.length > 1 &&
     isQuoted(val)) ||
    val !== val.trim())
    ? JSON.stringify(val)
    : val.replace(/;/g, '\\;').replace(/#/g, '\\#');

const unsafe = (val, doUnesc) => {
  val = (val || '').trim();
  if (isQuoted(val)) {
    // remove the single quotes before calling JSON.parse
    if (val.charAt(0) === "'")
      val = val.substr(1, val.length - 2);

    try {
      val = JSON.parse(val);
    } catch (_) {}
  } else {
    // walk the val to find the first not-escaped ; character
    let esc = false;
    let unesc = '';
    for (let i = 0, l = val.length; i < l; i++) {
      const c = val.charAt(i);
      if (esc) {
        if ('\\;#'.indexOf(c) !== -1)
          unesc += c;
        else
          unesc += '\\' + c;

        esc = false;
      } else if (';#'.indexOf(c) !== -1)
        break
      else if (c === '\\')
        esc = true;
      else
        unesc += c;
    }
    if (esc)
      unesc += '\\';

    return unesc.trim()
  }
  return val
};

var ini = {
  parse: decode,
  decode,
  stringify: encode,
  encode,
  safe,
  unsafe,
};

(function (exports) {
const path = path__default['default'];
const os = require$$1__default['default'];
const fs = require$$0__default['default'];
const ini$1 = ini;

const isWindows = process.platform === 'win32';

const readRc = filePath => {
	try {
		return ini$1.parse(fs.readFileSync(filePath, 'utf8')).prefix;
	} catch {}
};

const getEnvNpmPrefix = () => {
	// TODO: Remove the `.reduce` call.
	// eslint-disable-next-line unicorn/no-array-reduce
	return Object.keys(process.env).reduce((prefix, name) => {
		return /^npm_config_prefix$/i.test(name) ? process.env[name] : prefix;
	}, undefined);
};

const getGlobalNpmrc = () => {
	if (isWindows && process.env.APPDATA) {
		// Hardcoded contents of `c:\Program Files\nodejs\node_modules\npm\npmrc`
		return path.join(process.env.APPDATA, '/npm/etc/npmrc');
	}

	// Homebrew special case: `$(brew --prefix)/lib/node_modules/npm/npmrc`
	if (process.execPath.includes('/Cellar/node')) {
		const homebrewPrefix = process.execPath.slice(0, process.execPath.indexOf('/Cellar/node'));
		return path.join(homebrewPrefix, '/lib/node_modules/npm/npmrc');
	}

	if (process.execPath.endsWith('/bin/node')) {
		const installDir = path.dirname(path.dirname(process.execPath));
		return path.join(installDir, '/etc/npmrc');
	}
};

const getDefaultNpmPrefix = () => {
	if (isWindows) {
		// `c:\node\node.exe` → `prefix=c:\node\`
		return path.dirname(process.execPath);
	}

	// `/usr/local/bin/node` → `prefix=/usr/local`
	return path.dirname(path.dirname(process.execPath));
};

const getNpmPrefix = () => {
	const envPrefix = getEnvNpmPrefix();
	if (envPrefix) {
		return envPrefix;
	}

	const homePrefix = readRc(path.join(os.homedir(), '.npmrc'));
	if (homePrefix) {
		return homePrefix;
	}

	if (process.env.PREFIX) {
		return process.env.PREFIX;
	}

	const globalPrefix = readRc(getGlobalNpmrc());
	if (globalPrefix) {
		return globalPrefix;
	}

	return getDefaultNpmPrefix();
};

const npmPrefix = path.resolve(getNpmPrefix());

const getYarnWindowsDirectory = () => {
	if (isWindows && process.env.LOCALAPPDATA) {
		const dir = path.join(process.env.LOCALAPPDATA, 'Yarn');
		if (fs.existsSync(dir)) {
			return dir;
		}
	}

	return false;
};

const getYarnPrefix = () => {
	if (process.env.PREFIX) {
		return process.env.PREFIX;
	}

	const windowsPrefix = getYarnWindowsDirectory();
	if (windowsPrefix) {
		return windowsPrefix;
	}

	const configPrefix = path.join(os.homedir(), '.config/yarn');
	if (fs.existsSync(configPrefix)) {
		return configPrefix;
	}

	const homePrefix = path.join(os.homedir(), '.yarn-config');
	if (fs.existsSync(homePrefix)) {
		return homePrefix;
	}

	// Yarn supports the npm conventions but the inverse is not true
	return npmPrefix;
};

exports.npm = {};
exports.npm.prefix = npmPrefix;
exports.npm.packages = path.join(npmPrefix, isWindows ? 'node_modules' : 'lib/node_modules');
exports.npm.binaries = isWindows ? npmPrefix : path.join(npmPrefix, 'bin');

const yarnPrefix = path.resolve(getYarnPrefix());
exports.yarn = {};
exports.yarn.prefix = yarnPrefix;
exports.yarn.packages = path.join(yarnPrefix, getYarnWindowsDirectory() ? 'Data/global/node_modules' : 'global/node_modules');
exports.yarn.binaries = path.join(exports.yarn.packages, '.bin');
}(globalDirs));

const __dirname$1 = getModulePaths((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href))).__dirname;

/**
≈ Used once by either the cli or library depending on which is being used.
*/
async function loadPlugins (pluginNames) {
  const plugins = [];
  for (const pluginName of arrayify(pluginNames)) {
    let PluginClass;
    if (pluginName === 'find-replace') {
      plugins.push(new FindReplace());
    } else if (pluginName === 'index-replace') {
      plugins.push(new IndexReplace());
    } else if (typeof pluginName === 'string') {
      /* look for user-installed plugin both locally and globally */
      PluginClass = await loadModuleResolvedFrom(pluginName, [
        process.cwd(),
        globalDirs.npm.packages,
        globalDirs.yarn.packages
      ]);
      if (PluginClass === null) {
        PluginClass = await loadModuleRelativeTo(pluginName, [process.cwd(), path__default['default'].resolve(__dirname$1, './chain')]);
      }
      if (PluginClass === null) {
        throw new Error('plugin could not be found: ' + pluginName)
      } else if (PluginClass && !isClass(PluginClass)) {
        throw new Error('Invalid plugin: plugin module must export a class')
      } else {
        plugins.push(new PluginClass());
      }
    } else if (isClass(pluginName)) {
      const Plugin = pluginName;
      plugins.push(new Plugin());
    } else {
      plugins.push(pluginName);
    }
  }
  if (!plugins.every(p => p.replace)) {
    throw new Error('Invalid plugin: plugin class must implement a replace method')
  }
  return plugins
}

async function isFileAccessible (file) {
  try {
    await fs__namespace.access(file, require$$0.constants.R_OK | require$$0.constants.W_OK);
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    } else {
      throw err
    }
  }
}

function depthFirstCompare (a, b) {
  a = path__default['default'].normalize(a);
  b = path__default['default'].normalize(b);
  const depth = {
    a: a.split(path__default['default'].sep).length,
    b: b.split(path__default['default'].sep).length
  };
  if (depth.a > depth.b) {
    return -1
  } if (depth.a === depth.b) {
    return 0
  } else {
    return 1
  }
}

const dryRunLog = {};

/**
 * @param {string} - The current file path.
 * @param {string} - To file path to renamer to.
 * @param {object} [options] - Options object.
 * @param {boolean} [options.force] - Force the rename, even if `fs.exists` reports the `to` path exists.
 * @param {boolean} [options.dryRun] - Simulate the rename.
 */
async function renameFile (from, to, options) {
  options = options || {};
  /* Prevent user over-writing an existing, accessible file, unless --force specified */
  if (await isFileAccessible(to) && !options.force) {
    const err = new Error(`Unable to rename ${from} to ${to} [file exists]`);
    err.code = 'exists';
    throw err
  } else {
    if (options.dryRun) {
      if (dryRunLog[to] && !options.force) {
        throw new Error(`Unable to rename "${from}" to "${to}" [file exists]`)
      } else {
        dryRunLog[to] = from;
      }
    } else {
      await fs__namespace.rename(from, to);
    }
  }
}

class ReplaceChain {
  async loadPlugins (pluginNames) {
    pluginNames = arrayify(pluginNames);
    if (pluginNames.length) {
      this.plugins = await loadPlugins(pluginNames);
    } else {
      this.plugins = [new FindReplace(), new IndexReplace()];
    }
  }

  /**
   * If `find` is falsy, the entire filename is replaced.
   * @returns {from: string, to: string, renamed: boolean} - ReplaceChain result
   */
  replace (file, options, index, files) {
    let to = '';
    let input = file;
    /* replace pipeline */
    for (const plugin of this.plugins) {
      to = plugin.replace(input, options, index, files);
      input = to;
    }
    const renamed = path__default['default'].resolve(file) !== path__default['default'].resolve(to);
    if (!renamed) to = null;
    return { from: file, to, renamed }
  }
}

var old$1 = {};

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = path__default['default'];
var isWindows = process.platform === 'win32';
var fs$3 = require$$0__default['default'];

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

old$1.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs$3.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs$3.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs$3.statSync(base);
        linkTarget = fs$3.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


old$1.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs$3.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs$3.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs$3.stat(base, function(err) {
      if (err) return cb(err);

      fs$3.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};

var fs_realpath = realpath;
realpath.realpath = realpath;
realpath.sync = realpathSync;
realpath.realpathSync = realpathSync;
realpath.monkeypatch = monkeypatch;
realpath.unmonkeypatch = unmonkeypatch;

var fs$2 = require$$0__default['default'];
var origRealpath = fs$2.realpath;
var origRealpathSync = fs$2.realpathSync;

var version = process.version;
var ok = /^v[0-5]\./.test(version);
var old = old$1;

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache;
    cache = null;
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb);
    } else {
      cb(er, result);
    }
  });
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs$2.realpath = realpath;
  fs$2.realpathSync = realpathSync;
}

function unmonkeypatch () {
  fs$2.realpath = origRealpath;
  fs$2.realpathSync = origRealpathSync;
}

var concatMap$1 = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var balancedMatch = balanced$1;
function balanced$1(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced$1.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}

var concatMap = concatMap$1;
var balanced = balancedMatch;

var braceExpansion = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand$1(escapeBraces(str), true).map(unescapeBraces);
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand$1(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand$1(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand$1(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand$1(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand$1(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length);
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand$1(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}

var minimatch_1 = minimatch$3;
minimatch$3.Minimatch = Minimatch$1;

var path$3 = { sep: '/' };
try {
  path$3 = path__default['default'];
} catch (er) {}

var GLOBSTAR = minimatch$3.GLOBSTAR = Minimatch$1.GLOBSTAR = {};
var expand = braceExpansion;

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
};

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]';

// * => any number of characters
var star = qmark + '*?';

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!');

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true;
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/;

minimatch$3.filter = filter;
function filter (pattern, options) {
  options = options || {};
  return function (p, i, list) {
    return minimatch$3(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {};
  b = b || {};
  var t = {};
  Object.keys(b).forEach(function (k) {
    t[k] = b[k];
  });
  Object.keys(a).forEach(function (k) {
    t[k] = a[k];
  });
  return t
}

minimatch$3.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch$3

  var orig = minimatch$3;

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  };

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  };

  return m
};

Minimatch$1.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch$1
  return minimatch$3.defaults(def).Minimatch
};

function minimatch$3 (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {};

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch$1(pattern, options).match(p)
}

function Minimatch$1 (pattern, options) {
  if (!(this instanceof Minimatch$1)) {
    return new Minimatch$1(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {};
  pattern = pattern.trim();

  // windows support: need to use /, not \
  if (path$3.sep !== '/') {
    pattern = pattern.split(path$3.sep).join('/');
  }

  this.options = options;
  this.set = [];
  this.pattern = pattern;
  this.regexp = null;
  this.negate = false;
  this.comment = false;
  this.empty = false;

  // make the set of regexps etc.
  this.make();
}

Minimatch$1.prototype.debug = function () {};

Minimatch$1.prototype.make = make;
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern;
  var options = this.options;

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true;
    return
  }
  if (!pattern) {
    this.empty = true;
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate();

  // step 2: expand braces
  var set = this.globSet = this.braceExpand();

  if (options.debug) this.debug = console.error;

  this.debug(this.pattern, set);

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  });

  this.debug(this.pattern, set);

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this);

  this.debug(this.pattern, set);

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  });

  this.debug(this.pattern, set);

  this.set = set;
}

Minimatch$1.prototype.parseNegate = parseNegate;
function parseNegate () {
  var pattern = this.pattern;
  var negate = false;
  var options = this.options;
  var negateOffset = 0;

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate;
    negateOffset++;
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset);
  this.negate = negate;
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch$3.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
};

Minimatch$1.prototype.braceExpand = braceExpand;

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch$1) {
      options = this.options;
    } else {
      options = {};
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern;

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch$1.prototype.parse = parse;
var SUBPARSE = {};
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options;

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = '';
  var hasMagic = !!options.nocase;
  var escaping = false;
  // ? => one single character
  var patternListStack = [];
  var negativeLists = [];
  var stateChar;
  var inClass = false;
  var reClassStart = -1;
  var classStart = -1;
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)';
  var self = this;

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star;
          hasMagic = true;
        break
        case '?':
          re += qmark;
          hasMagic = true;
        break
        default:
          re += '\\' + stateChar;
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re);
      stateChar = false;
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c);

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c;
      escaping = false;
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar();
        escaping = true;
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class');
          if (c === '!' && i === classStart + 1) c = '^';
          re += c;
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar);
        clearStateChar();
        stateChar = c;
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar();
      continue

      case '(':
        if (inClass) {
          re += '(';
          continue
        }

        if (!stateChar) {
          re += '\\(';
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        });
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:';
        this.debug('plType %j %j', stateChar, re);
        stateChar = false;
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)';
          continue
        }

        clearStateChar();
        hasMagic = true;
        var pl = patternListStack.pop();
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close;
        if (pl.type === '!') {
          negativeLists.push(pl);
        }
        pl.reEnd = re.length;
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|';
          escaping = false;
          continue
        }

        clearStateChar();
        re += '|';
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar();

        if (inClass) {
          re += '\\' + c;
          continue
        }

        inClass = true;
        classStart = i;
        reClassStart = re.length;
        re += c;
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c;
          escaping = false;
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i);
          try {
            RegExp('[' + cs + ']');
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE);
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]';
            hasMagic = hasMagic || sp[1];
            inClass = false;
            continue
          }
        }

        // finish up the class.
        hasMagic = true;
        inClass = false;
        re += c;
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar();

        if (escaping) {
          // no need
          escaping = false;
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\';
        }

        re += c;

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1);
    sp = this.parse(cs, SUBPARSE);
    re = re.substr(0, reClassStart) + '\\[' + sp[0];
    hasMagic = hasMagic || sp[1];
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length);
    this.debug('setting tail', re, pl);
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\';
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    });

    this.debug('tail=%j\n   %s', tail, tail, pl, re);
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type;

    hasMagic = true;
    re = re.slice(0, pl.reStart) + t + '\\(' + tail;
  }

  // handle trailing things that only matter at the very end.
  clearStateChar();
  if (escaping) {
    // trailing \\
    re += '\\\\';
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false;
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true;
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n];

    var nlBefore = re.slice(0, nl.reStart);
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
    var nlAfter = re.slice(nl.reEnd);

    nlLast += nlAfter;

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1;
    var cleanAfter = nlAfter;
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
    }
    nlAfter = cleanAfter;

    var dollar = '';
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$';
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
    re = newRe;
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re;
  }

  if (addPatternStart) {
    re = patternStart + re;
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : '';
  try {
    var regExp = new RegExp('^' + re + '$', flags);
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern;
  regExp._src = re;

  return regExp
}

minimatch$3.makeRe = function (pattern, options) {
  return new Minimatch$1(pattern, options || {}).makeRe()
};

Minimatch$1.prototype.makeRe = makeRe;
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set;

  if (!set.length) {
    this.regexp = false;
    return this.regexp
  }
  var options = this.options;

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot;
  var flags = options.nocase ? 'i' : '';

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|');

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$';

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$';

  try {
    this.regexp = new RegExp(re, flags);
  } catch (ex) {
    this.regexp = false;
  }
  return this.regexp
}

minimatch$3.match = function (list, pattern, options) {
  options = options || {};
  var mm = new Minimatch$1(pattern, options);
  list = list.filter(function (f) {
    return mm.match(f)
  });
  if (mm.options.nonull && !list.length) {
    list.push(pattern);
  }
  return list
};

Minimatch$1.prototype.match = match;
function match (f, partial) {
  this.debug('match', f, this.pattern);
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options;

  // windows: need to use /, not \
  if (path$3.sep !== '/') {
    f = f.split(path$3.sep).join('/');
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit);
  this.debug(this.pattern, 'split', f);

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set;
  this.debug(this.pattern, 'set', set);

  // Find the basename of the path by looking for the last non-empty segment
  var filename;
  var i;
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i];
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i];
    var file = f;
    if (options.matchBase && pattern.length === 1) {
      file = [filename];
    }
    var hit = this.matchOne(file, pattern, partial);
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch$1.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options;

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern });

  this.debug('matchOne', file.length, pattern.length);

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop');
    var p = pattern[pi];
    var f = file[fi];

    this.debug(pattern, p, f);

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f]);

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi;
      var pr = pi + 1;
      if (pr === pl) {
        this.debug('** at the end');
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr];

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee);
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr);
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue');
          fr++;
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit;
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase();
      } else {
        hit = f === p;
      }
      this.debug('string match', p, f, hit);
    } else {
      hit = f.match(p);
      this.debug('pattern match', p, f, hit);
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '');
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
};

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

var inherits$1 = {exports: {}};

var inherits_browser = {exports: {}};

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  inherits_browser.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  inherits_browser.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}

try {
  var util = require$$0__default$1['default'];
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  inherits$1.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  inherits$1.exports = inherits_browser.exports;
}

var pathIsAbsolute = {exports: {}};

function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

pathIsAbsolute.exports = process.platform === 'win32' ? win32 : posix;
pathIsAbsolute.exports.posix = posix;
pathIsAbsolute.exports.win32 = win32;

var common$2 = {};

common$2.setopts = setopts$2;
common$2.ownProp = ownProp$2;
common$2.makeAbs = makeAbs;
common$2.finish = finish;
common$2.mark = mark;
common$2.isIgnored = isIgnored$2;
common$2.childrenIgnored = childrenIgnored$2;

function ownProp$2 (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path$2 = path__default['default'];
var minimatch$2 = minimatch_1;
var isAbsolute$2 = pathIsAbsolute.exports;
var Minimatch = minimatch$2.Minimatch;

function alphasort (a, b) {
  return a.localeCompare(b, 'en')
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || [];

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore];

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap);
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null;
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '');
    gmatcher = new Minimatch(gpattern, { dot: true });
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts$2 (self, pattern, options) {
  if (!options)
    options = {};

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern;
  }

  self.silent = !!options.silent;
  self.pattern = pattern;
  self.strict = options.strict !== false;
  self.realpath = !!options.realpath;
  self.realpathCache = options.realpathCache || Object.create(null);
  self.follow = !!options.follow;
  self.dot = !!options.dot;
  self.mark = !!options.mark;
  self.nodir = !!options.nodir;
  if (self.nodir)
    self.mark = true;
  self.sync = !!options.sync;
  self.nounique = !!options.nounique;
  self.nonull = !!options.nonull;
  self.nosort = !!options.nosort;
  self.nocase = !!options.nocase;
  self.stat = !!options.stat;
  self.noprocess = !!options.noprocess;
  self.absolute = !!options.absolute;

  self.maxLength = options.maxLength || Infinity;
  self.cache = options.cache || Object.create(null);
  self.statCache = options.statCache || Object.create(null);
  self.symlinks = options.symlinks || Object.create(null);

  setupIgnores(self, options);

  self.changedCwd = false;
  var cwd = process.cwd();
  if (!ownProp$2(options, "cwd"))
    self.cwd = cwd;
  else {
    self.cwd = path$2.resolve(options.cwd);
    self.changedCwd = self.cwd !== cwd;
  }

  self.root = options.root || path$2.resolve(self.cwd, "/");
  self.root = path$2.resolve(self.root);
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/");

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute$2(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
  self.nomount = !!options.nomount;

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true;
  options.nocomment = true;

  self.minimatch = new Minimatch(pattern, options);
  self.options = self.minimatch.options;
}

function finish (self) {
  var nou = self.nounique;
  var all = nou ? [] : Object.create(null);

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i];
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i];
        if (nou)
          all.push(literal);
        else
          all[literal] = true;
      }
    } else {
      // had matches
      var m = Object.keys(matches);
      if (nou)
        all.push.apply(all, m);
      else
        m.forEach(function (m) {
          all[m] = true;
        });
    }
  }

  if (!nou)
    all = Object.keys(all);

  if (!self.nosort)
    all = all.sort(alphasort);

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i]);
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e));
        var c = self.cache[e] || self.cache[makeAbs(self, e)];
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c);
        return notDir
      });
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored$2(self, m)
    });

  self.found = all;
}

function mark (self, p) {
  var abs = makeAbs(self, p);
  var c = self.cache[abs];
  var m = p;
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c);
    var slash = p.slice(-1) === '/';

    if (isDir && !slash)
      m += '/';
    else if (!isDir && slash)
      m = m.slice(0, -1);

    if (m !== p) {
      var mabs = makeAbs(self, m);
      self.statCache[mabs] = self.statCache[abs];
      self.cache[mabs] = self.cache[abs];
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f;
  if (f.charAt(0) === '/') {
    abs = path$2.join(self.root, f);
  } else if (isAbsolute$2(f) || f === '') {
    abs = f;
  } else if (self.changedCwd) {
    abs = path$2.resolve(self.cwd, f);
  } else {
    abs = path$2.resolve(f);
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/');

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored$2 (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored$2 (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}

var sync = globSync$1;
globSync$1.GlobSync = GlobSync$1;

var fs$1 = require$$0__default['default'];
var rp$1 = fs_realpath;
var minimatch$1 = minimatch_1;
var path$1 = path__default['default'];
var assert$1 = require$$6__default['default'];
var isAbsolute$1 = pathIsAbsolute.exports;
var common$1 = common$2;
var setopts$1 = common$1.setopts;
var ownProp$1 = common$1.ownProp;
var childrenIgnored$1 = common$1.childrenIgnored;
var isIgnored$1 = common$1.isIgnored;

function globSync$1 (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync$1(pattern, options).found
}

function GlobSync$1 (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync$1))
    return new GlobSync$1(pattern, options)

  setopts$1(this, pattern, options);

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length;
  this.matches = new Array(n);
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false);
  }
  this._finish();
}

GlobSync$1.prototype._finish = function () {
  assert$1(this instanceof GlobSync$1);
  if (this.realpath) {
    var self = this;
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null);
      for (var p in matchset) {
        try {
          p = self._makeAbs(p);
          var real = rp$1.realpathSync(p, self.realpathCache);
          set[real] = true;
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true;
          else
            throw er
        }
      }
    });
  }
  common$1.finish(this);
};


GlobSync$1.prototype._process = function (pattern, index, inGlobStar) {
  assert$1(this instanceof GlobSync$1);

  // Get the first [n] parts of pattern that are all strings.
  var n = 0;
  while (typeof pattern[n] === 'string') {
    n ++;
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix;
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index);
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null;
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/');
      break
  }

  var remain = pattern.slice(n);

  // get the list of entries.
  var read;
  if (prefix === null)
    read = '.';
  else if (isAbsolute$1(prefix) || isAbsolute$1(pattern.join('/'))) {
    if (!prefix || !isAbsolute$1(prefix))
      prefix = '/' + prefix;
    read = prefix;
  } else
    read = prefix;

  var abs = this._makeAbs(read);

  //if ignored, skip processing
  if (childrenIgnored$1(this, read))
    return

  var isGlobStar = remain[0] === minimatch$1.GLOBSTAR;
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
};


GlobSync$1.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar);

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0];
  var negate = !!this.minimatch.negate;
  var rawGlob = pn._glob;
  var dotOk = this.dot || rawGlob.charAt(0) === '.';

  var matchedEntries = [];
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (e.charAt(0) !== '.' || dotOk) {
      var m;
      if (negate && !prefix) {
        m = !e.match(pn);
      } else {
        m = e.match(pn);
      }
      if (m)
        matchedEntries.push(e);
    }
  }

  var len = matchedEntries.length;
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null);

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i];
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e;
        else
          e = prefix + e;
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path$1.join(this.root, e);
      }
      this._emitMatch(index, e);
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift();
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i];
    var newPattern;
    if (prefix)
      newPattern = [prefix, e];
    else
      newPattern = [e];
    this._process(newPattern.concat(remain), index, inGlobStar);
  }
};


GlobSync$1.prototype._emitMatch = function (index, e) {
  if (isIgnored$1(this, e))
    return

  var abs = this._makeAbs(e);

  if (this.mark)
    e = this._mark(e);

  if (this.absolute) {
    e = abs;
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs];
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true;

  if (this.stat)
    this._stat(e);
};


GlobSync$1.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries;
  var lstat;
  try {
    lstat = fs$1.lstatSync(abs);
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink();
  this.symlinks[abs] = isSym;

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE';
  else
    entries = this._readdir(abs, false);

  return entries
};

GlobSync$1.prototype._readdir = function (abs, inGlobStar) {

  if (inGlobStar && !ownProp$1(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp$1(this.cache, abs)) {
    var c = this.cache[abs];
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs$1.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er);
    return null
  }
};

GlobSync$1.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i];
      if (abs === '/')
        e = abs + e;
      else
        e = abs + '/' + e;
      this.cache[e] = true;
    }
  }

  this.cache[abs] = entries;

  // mark and cache dir-ness
  return entries
};

GlobSync$1.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f);
      this.cache[abs] = 'FILE';
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
        error.path = this.cwd;
        error.code = er.code;
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false;
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false;
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er);
      break
  }
};

GlobSync$1.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar);

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1);
  var gspref = prefix ? [ prefix ] : [];
  var noGlobStar = gspref.concat(remainWithoutGlobStar);

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false);

  var len = entries.length;
  var isSym = this.symlinks[abs];

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i];
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
    this._process(instead, index, true);

    var below = gspref.concat(entries[i], remain);
    this._process(below, index, true);
  }
};

GlobSync$1.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix);

  if (!this.matches[index])
    this.matches[index] = Object.create(null);

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute$1(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix);
    if (prefix.charAt(0) === '/') {
      prefix = path$1.join(this.root, prefix);
    } else {
      prefix = path$1.resolve(this.root, prefix);
      if (trail)
        prefix += '/';
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/');

  // Mark this as a match
  this._emitMatch(index, prefix);
};

// Returns either 'DIR', 'FILE', or false
GlobSync$1.prototype._stat = function (f) {
  var abs = this._makeAbs(f);
  var needDir = f.slice(-1) === '/';

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp$1(this.cache, abs)) {
    var c = this.cache[abs];

    if (Array.isArray(c))
      c = 'DIR';

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }
  var stat = this.statCache[abs];
  if (!stat) {
    var lstat;
    try {
      lstat = fs$1.lstatSync(abs);
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false;
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs$1.statSync(abs);
      } catch (er) {
        stat = lstat;
      }
    } else {
      stat = lstat;
    }
  }

  this.statCache[abs] = stat;

  var c = true;
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE';

  this.cache[abs] = this.cache[abs] || c;

  if (needDir && c === 'FILE')
    return false

  return c
};

GlobSync$1.prototype._mark = function (p) {
  return common$1.mark(this, p)
};

GlobSync$1.prototype._makeAbs = function (f) {
  return common$1.makeAbs(this, f)
};

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
var wrappy_1 = wrappy$2;
function wrappy$2 (fn, cb) {
  if (fn && cb) return wrappy$2(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k];
  });

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    var ret = fn.apply(this, args);
    var cb = args[args.length-1];
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k];
      });
    }
    return ret
  }
}

var once$3 = {exports: {}};

var wrappy$1 = wrappy_1;
once$3.exports = wrappy$1(once$2);
once$3.exports.strict = wrappy$1(onceStrict);

once$2.proto = once$2(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once$2(this)
    },
    configurable: true
  });

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  });
});

function once$2 (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  f.called = false;
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true;
    return f.value = fn.apply(this, arguments)
  };
  var name = fn.name || 'Function wrapped with `once`';
  f.onceError = name + " shouldn't be called more than once";
  f.called = false;
  return f
}

var wrappy = wrappy_1;
var reqs = Object.create(null);
var once$1 = once$3.exports;

var inflight_1 = wrappy(inflight$1);

function inflight$1 (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb);
    return null
  } else {
    reqs[key] = [cb];
    return makeres(key)
  }
}

function makeres (key) {
  return once$1(function RES () {
    var cbs = reqs[key];
    var len = cbs.length;
    var args = slice(arguments);

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args);
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len);
        process.nextTick(function () {
          RES.apply(null, args);
        });
      } else {
        delete reqs[key];
      }
    }
  })
}

function slice (args) {
  var length = args.length;
  var array = [];

  for (var i = 0; i < length; i++) array[i] = args[i];
  return array
}

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

var glob_1 = glob;

var fs = require$$0__default['default'];
var rp = fs_realpath;
var minimatch = minimatch_1;
var inherits = inherits$1.exports;
var EE = require$$4__default['default'].EventEmitter;
var path = path__default['default'];
var assert = require$$6__default['default'];
var isAbsolute = pathIsAbsolute.exports;
var globSync = sync;
var common = common$2;
var setopts = common.setopts;
var ownProp = common.ownProp;
var inflight = inflight_1;
var childrenIgnored = common.childrenIgnored;
var isIgnored = common.isIgnored;

var once = once$3.exports;

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {};
  if (!options) options = {};

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync;
var GlobSync = glob.GlobSync = globSync.GlobSync;

// old api surface
glob.glob = glob;

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_);
  options.noprocess = true;

  var g = new Glob(pattern, options);
  var set = g.minimatch.set;

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
};

glob.Glob = Glob;
inherits(Glob, EE);
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = null;
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options);
  this._didRealPath = false;

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length;

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n);

  if (typeof cb === 'function') {
    cb = once(cb);
    this.on('error', cb);
    this.on('end', function (matches) {
      cb(null, matches);
    });
  }

  var self = this;
  this._processing = 0;

  this._emitQueue = [];
  this._processQueue = [];
  this.paused = false;

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true;
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done);
  }
  sync = false;

  function done () {
    --self._processing;
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish();
        });
      } else {
        self._finish();
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob);
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this);
  this.emit('end', this.found);
};

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true;

  var n = this.matches.length;
  if (n === 0)
    return this._finish()

  var self = this;
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next);

  function next () {
    if (--n === 0)
      self._finish();
  }
};

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index];
  if (!matchset)
    return cb()

  var found = Object.keys(matchset);
  var self = this;
  var n = found.length;

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null);
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p);
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true;
      else if (er.syscall === 'stat')
        set[p] = true;
      else
        self.emit('error', er); // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set;
        cb();
      }
    });
  });
};

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
};

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
};

Glob.prototype.abort = function () {
  this.aborted = true;
  this.emit('abort');
};

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true;
    this.emit('pause');
  }
};

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume');
    this.paused = false;
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0);
      this._emitQueue.length = 0;
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i];
        this._emitMatch(e[0], e[1]);
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0);
      this._processQueue.length = 0;
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i];
        this._processing--;
        this._process(p[0], p[1], p[2], p[3]);
      }
    }
  }
};

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob);
  assert(typeof cb === 'function');

  if (this.aborted)
    return

  this._processing++;
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb]);
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0;
  while (typeof pattern[n] === 'string') {
    n ++;
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix;
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb);
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null;
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/');
      break
  }

  var remain = pattern.slice(n);

  // get the list of entries.
  var read;
  if (prefix === null)
    read = '.';
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix;
    read = prefix;
  } else
    read = prefix;

  var abs = this._makeAbs(read);

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR;
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
};

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this;
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  });
};

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0];
  var negate = !!this.minimatch.negate;
  var rawGlob = pn._glob;
  var dotOk = this.dot || rawGlob.charAt(0) === '.';

  var matchedEntries = [];
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (e.charAt(0) !== '.' || dotOk) {
      var m;
      if (negate && !prefix) {
        m = !e.match(pn);
      } else {
        m = e.match(pn);
      }
      if (m)
        matchedEntries.push(e);
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length;
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null);

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i];
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e;
        else
          e = prefix + e;
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e);
      }
      this._emitMatch(index, e);
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift();
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i];
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e;
      else
        e = prefix + e;
    }
    this._process([e].concat(remain), index, inGlobStar, cb);
  }
  cb();
};

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e]);
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e);

  if (this.mark)
    e = this._mark(e);

  if (this.absolute)
    e = abs;

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs];
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true;

  var st = this.statCache[abs];
  if (st)
    this.emit('stat', e, st);

  this.emit('match', e);
};

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs;
  var self = this;
  var lstatcb = inflight(lstatkey, lstatcb_);

  if (lstatcb)
    fs.lstat(abs, lstatcb);

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink();
    self.symlinks[abs] = isSym;

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE';
      cb();
    } else
      self._readdir(abs, false, cb);
  }
};

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb);
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs];
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }
  fs.readdir(abs, readdirCb(this, abs, cb));
};

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb);
    else
      self._readdirEntries(abs, entries, cb);
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i];
      if (abs === '/')
        e = abs + e;
      else
        e = abs + '/' + e;
      this.cache[e] = true;
    }
  }

  this.cache[abs] = entries;
  return cb(null, entries)
};

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f);
      this.cache[abs] = 'FILE';
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
        error.path = this.cwd;
        error.code = er.code;
        this.emit('error', error);
        this.abort();
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false;
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false;
      if (this.strict) {
        this.emit('error', er);
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort();
      }
      if (!this.silent)
        console.error('glob error', er);
      break
  }

  return cb()
};

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this;
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
  });
};


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1);
  var gspref = prefix ? [ prefix ] : [];
  var noGlobStar = gspref.concat(remainWithoutGlobStar);

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb);

  var isSym = this.symlinks[abs];
  var len = entries.length;

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i];
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
    this._process(instead, index, true, cb);

    var below = gspref.concat(entries[i], remain);
    this._process(below, index, true, cb);
  }

  cb();
};

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this;
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb);
  });
};
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null);

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix);
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix);
    } else {
      prefix = path.resolve(this.root, prefix);
      if (trail)
        prefix += '/';
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/');

  // Mark this as a match
  this._emitMatch(index, prefix);
  cb();
};

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f);
  var needDir = f.slice(-1) === '/';

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs];

    if (Array.isArray(c))
      c = 'DIR';

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }
  var stat = this.statCache[abs];
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE';
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this;
  var statcb = inflight('stat\0' + abs, lstatcb_);
  if (statcb)
    fs.lstat(abs, statcb);

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb);
        else
          self._stat2(f, abs, er, stat, cb);
      })
    } else {
      self._stat2(f, abs, er, lstat, cb);
    }
  }
};

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false;
    return cb()
  }

  var needDir = f.slice(-1) === '/';
  this.statCache[abs] = stat;

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true;
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE';
  this.cache[abs] = this.cache[abs] || c;

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
};

class FileSet {
  constructor () {
    /** • fileSet.files :string[]
    ≈ The existing files found.
    */
    this.files = [];

    /** • fileSet.dirs :string[]
    ≈ The existing directories found. Directory paths will always end with `'/'`.
    */
    this.dirs = [];

    /** • fileSet.notExisting :string[]
    ≈ Paths which were not found.
    */
    this.notExisting = [];
  }

  /** ø fileSet.add(patterns)
  ≈ Add file patterns to the set.
  • [patterns] :string|string[] - One or more file paths or glob expressions to inspect.
  */
  async add (files) {
    files = arrayify(files);
    for (const file of files) {
      try {
        const stat = await fs__namespace.stat(file);
        if (stat.isFile() && !this.files.includes(file)) {
          this.files.push(file);
        } else if (stat.isDirectory() && !this.dirs.includes(file)) {
          this.dirs.push(file.endsWith('/') ? file : `${file}/`);
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          if (glob_1.hasMagic(file)) {
            const found = await doGlob(file);
            if (found.length) {
              for (const match of found) {
                if (match.endsWith('/')) {
                  if (!this.dirs.includes(match)) this.dirs.push(match);
                } else {
                  if (!this.files.includes(match)) this.files.push(match);
                }
              }
            } else {
              if (!this.notExisting.includes(file)) this.notExisting.push(file);
            }
          } else {
            if (!this.notExisting.includes(file)) this.notExisting.push(file);
          }
        } else {
          throw err
        }
      }
    }
  }

  clear () {
    this.files = [];
    this.dirs = [];
    this.notExisting = [];
  }
}

async function doGlob (pattern) {
  return new Promise((resolve, reject) => {
    glob_1(pattern, { mark: true }, (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  })
}

/** ∆ Renamer
≈ A tool to rename files and folders in bulk.
*/
class Renamer {
  /** ø renamer.rename(options):Array<ReplaceResult>
  ≈ A synchronous method to rename files in bulk.

  • [options]             :object
  • [options.files]       :Array<string>  - One or more glob patterns or filenames to process.
  • [options.dryRun]      :boolean        - Set this to do everything but rename the file. You should always
                                            set this flag until certain the output looks correct.
  • [options.force]       :boolean        - If a target path exists, renamer will stop. With this flag set
                                            the target path will be overwritten. The main use-case for this flag is to enable changing the case of files on case-insensitive systems. Use with caution.
  • [options.chain]       :string[]       - One or more replacer plugins to use, set the `--chain` option
                                            multiple times to build a chain. For each value, supply either: a) a path to a plugin file b) a path to a plugin package c) the name of a plugin package installed globally or in the current working directory (or above) or d) the name of a built-in plugin, either `default` or `index`. The default plugin chain is `default` then `index`, be sure to set `-p default -p index` before your plugin if you wish to extend default behaviour.
  • [options.find]        :string|RegExp  - Optional find string (e.g. `one`) or regular expression literal (
                                            e.g. `/one/i`). If omitted, the whole filename will be matched and replaced.
  • [options.replace]     :string         - The replace string. If omitted, defaults to a empty string.
  • [options.pathElement] :string         - The path element to rename, valid values are `base` (the
                                            default), `name` and `ext`. For example, in the path `pics/image.jpg`, the base is `image.jpg`, the name is `image` and the ext is `.jpg`.
  • [options.indexFormat] :string         - The format of the number to replace `{{index}}` with. Specify a
                                            standard printf format string, for example `%03d` would yield 001, 002, 003 etc. Defaults to `%d`.
  • [options.indexRoot]   :string         - The initial value for `{{index}}`. Defaults to 1.

  † ReplaceResult
  • from :string     - The filename before rename,
  • to :string       - The filename after rename.
  • renamed :boolean - True if the file was renamed.
  */
  async rename (options = {}) {
    const results = [];
    for await (const result of this.results(options)) {
      results.push(result);
    }
    return results
  }

  /** ø renamer.results(options):iterator
  ≈ Useful when you want process the renames one-by-one.
  ¥ ReplaceResult
  */
  async * results (options = {}) {
    const fileSet = new FileSet();
    await fileSet.add(options.files);
    if (fileSet.notExisting.length) {
      throw new Error(`These paths or patterns do not exist: ${fileSet.notExisting.join(', ')}`)
    }
    const replaceChain = new ReplaceChain();
    await replaceChain.loadPlugins(options.chain);
    const files = [...fileSet.files, ...fileSet.dirs.sort(depthFirstCompare)];
    const replaceResults = files
      .map((file, index) => replaceChain.replace(file, options, index, files));
    for (const replaceResult of replaceResults) {
      if (replaceResult.renamed) {
        await renameFile(replaceResult.from, replaceResult.to, { force: options.force, dryRun: options.dryRun });
      }
      yield replaceResult;
    }
  }
}

module.exports = Renamer;
