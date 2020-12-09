/* ES Module Shims 0.5.0 */
(function () {
  'use strict';

  const resolvedPromise = Promise.resolve();

  let baseUrl;

  function createBlob (source) {
    return URL.createObjectURL(new Blob([source], { type: 'application/javascript' }));
  }

  const hasDocument = typeof document !== 'undefined';

  // support browsers without dynamic import support (eg Firefox 6x)
  let dynamicImport;
  try {
    dynamicImport = (0, eval)('u=>import(u)');
  }
  catch (e) {
    if (hasDocument) {
      self.addEventListener('error', e => importShim.e = e.error);
      dynamicImport = blobUrl => {
        const topLevelBlobUrl = createBlob(
          `import*as m from'${blobUrl}';self.importShim.l=m;self.importShim.e=null`
        );
        const s = document.createElement('script');
        s.type = 'module';
        s.src = topLevelBlobUrl;
        document.head.appendChild(s);
        return new Promise((resolve, reject) => {
          s.addEventListener('load', () => {
            document.head.removeChild(s);
            importShim.e ? reject(importShim.e) : resolve(importShim.l, baseUrl);
          });
        });
      };
    }
  }

  if (hasDocument) {
    const baseEl = document.querySelector('base[href]');
    if (baseEl)
      baseUrl = baseEl.href;
  }

  if (!baseUrl && typeof location !== 'undefined') {
    baseUrl = location.href.split('#')[0].split('?')[0];
    const lastSepIndex = baseUrl.lastIndexOf('/');
    if (lastSepIndex !== -1)
      baseUrl = baseUrl.slice(0, lastSepIndex + 1);
  }

  let esModuleShimsSrc;
  if (hasDocument) {
    esModuleShimsSrc = document.currentScript && document.currentScript.src;
  }

  const backslashRegEx = /\\/g;
  function resolveIfNotPlainOrUrl (relUrl, parentUrl) {
    // strip off any trailing query params or hashes
    parentUrl = parentUrl && parentUrl.split('#')[0].split('?')[0];
    if (relUrl.indexOf('\\') !== -1)
      relUrl = relUrl.replace(backslashRegEx, '/');
    // protocol-relative
    if (relUrl[0] === '/' && relUrl[1] === '/') {
      return parentUrl.slice(0, parentUrl.indexOf(':') + 1) + relUrl;
    }
    // relative-url
    else if (relUrl[0] === '.' && (relUrl[1] === '/' || relUrl[1] === '.' && (relUrl[2] === '/' || relUrl.length === 2 && (relUrl += '/')) ||
        relUrl.length === 1  && (relUrl += '/')) ||
        relUrl[0] === '/') {
      const parentProtocol = parentUrl.slice(0, parentUrl.indexOf(':') + 1);
      // Disabled, but these cases will give inconsistent results for deep backtracking
      //if (parentUrl[parentProtocol.length] !== '/')
      //  throw new Error('Cannot resolve');
      // read pathname from parent URL
      // pathname taken to be part after leading "/"
      let pathname;
      if (parentUrl[parentProtocol.length + 1] === '/') {
        // resolving to a :// so we need to read out the auth and host
        if (parentProtocol !== 'file:') {
          pathname = parentUrl.slice(parentProtocol.length + 2);
          pathname = pathname.slice(pathname.indexOf('/') + 1);
        }
        else {
          pathname = parentUrl.slice(8);
        }
      }
      else {
        // resolving to :/ so pathname is the /... part
        pathname = parentUrl.slice(parentProtocol.length + (parentUrl[parentProtocol.length] === '/'));
      }

      if (relUrl[0] === '/')
        return parentUrl.slice(0, parentUrl.length - pathname.length - 1) + relUrl;

      // join together and split for removal of .. and . segments
      // looping the string instead of anything fancy for perf reasons
      // '../../../../../z' resolved to 'x/y' is just 'z'
      const segmented = pathname.slice(0, pathname.lastIndexOf('/') + 1) + relUrl;

      const output = [];
      let segmentIndex = -1;
      for (let i = 0; i < segmented.length; i++) {
        // busy reading a segment - only terminate on '/'
        if (segmentIndex !== -1) {
          if (segmented[i] === '/') {
            output.push(segmented.slice(segmentIndex, i + 1));
            segmentIndex = -1;
          }
        }

        // new segment - check if it is relative
        else if (segmented[i] === '.') {
          // ../ segment
          if (segmented[i + 1] === '.' && (segmented[i + 2] === '/' || i + 2 === segmented.length)) {
            output.pop();
            i += 2;
          }
          // ./ segment
          else if (segmented[i + 1] === '/' || i + 1 === segmented.length) {
            i += 1;
          }
          else {
            // the start of a new segment as below
            segmentIndex = i;
          }
        }
        // it is the start of a new segment
        else {
          segmentIndex = i;
        }
      }
      // finish reading out the last segment
      if (segmentIndex !== -1)
        output.push(segmented.slice(segmentIndex));
      return parentUrl.slice(0, parentUrl.length - pathname.length) + output.join('');
    }
  }

  /*
   * Import maps implementation
   *
   * To make lookups fast we pre-resolve the entire import map
   * and then match based on backtracked hash lookups
   *
   */
  function resolveUrl (relUrl, parentUrl) {
    return resolveIfNotPlainOrUrl(relUrl, parentUrl) || (relUrl.indexOf(':') !== -1 ? relUrl : resolveIfNotPlainOrUrl('./' + relUrl, parentUrl));
  }

  function resolveAndComposePackages (packages, outPackages, baseUrl, parentMap) {
    for (let p in packages) {
      const resolvedLhs = resolveIfNotPlainOrUrl(p, baseUrl) || p;
      let target = packages[p];
      if (typeof target !== 'string')
        continue;
      const mapped = resolveImportMap(parentMap, resolveIfNotPlainOrUrl(target, baseUrl) || target, baseUrl);
      if (mapped) {
        outPackages[resolvedLhs] = mapped;
        continue;
      }
      targetWarning(p, packages[p], 'bare specifier did not resolve');
    }
  }

  function resolveAndComposeImportMap (json, baseUrl, parentMap) {
    const outMap = { imports: Object.assign({}, parentMap.imports), scopes: Object.assign({}, parentMap.scopes), depcache: Object.assign({}, parentMap.depcache) };

    if (json.imports)
      resolveAndComposePackages(json.imports, outMap.imports, baseUrl, parentMap,);

    if (json.scopes)
      for (let s in json.scopes) {
        const resolvedScope = resolveUrl(s, baseUrl);
        resolveAndComposePackages(json.scopes[s], outMap.scopes[resolvedScope] || (outMap.scopes[resolvedScope] = {}), baseUrl, parentMap);
      }

    if (json.depcache)
      for (let d in json.depcache) {
        const resolvedDepcache = resolveUrl(d, baseUrl);
        outMap.depcache[resolvedDepcache] = json.depcache[d];
      }

    return outMap;
  }

  function getMatch (path, matchObj) {
    if (matchObj[path])
      return path;
    let sepIndex = path.length;
    do {
      const segment = path.slice(0, sepIndex + 1);
      if (segment in matchObj)
        return segment;
    } while ((sepIndex = path.lastIndexOf('/', sepIndex - 1)) !== -1)
  }

  function applyPackages (id, packages) {
    const pkgName = getMatch(id, packages);
    if (pkgName) {
      const pkg = packages[pkgName];
      if (pkg === null) return;
      if (id.length > pkgName.length && pkg[pkg.length - 1] !== '/')
        targetWarning(pkgName, pkg, "should have a trailing '/'");
      else
        return pkg + id.slice(pkgName.length);
    }
  }

  function targetWarning (match, target, msg) {
    console.warn("Package target " + msg + ", resolving target '" + target + "' for " + match);
  }

  function resolveImportMap (importMap, resolvedOrPlain, parentUrl) {
    let scopeUrl = parentUrl && getMatch(parentUrl, importMap.scopes);
    while (scopeUrl) {
      const packageResolution = applyPackages(resolvedOrPlain, importMap.scopes[scopeUrl]);
      if (packageResolution)
        return packageResolution;
      scopeUrl = getMatch(scopeUrl.slice(0, scopeUrl.lastIndexOf('/')), importMap.scopes);
    }
    return applyPackages(resolvedOrPlain, importMap.imports) || resolvedOrPlain.indexOf(':') !== -1 && resolvedOrPlain;
  }

  /* es-module-lexer 0.3.26 */
  const A=1===new Uint8Array(new Uint16Array([1]).buffer)[0];function parse(E,g="@"){if(!B)return init.then(()=>parse(E));const I=E.length+1,D=(B.__heap_base.value||B.__heap_base)+4*I-B.memory.buffer.byteLength;D>0&&B.memory.grow(Math.ceil(D/65536));const w=B.sa(I-1);if((A?C:Q)(E,new Uint16Array(B.memory.buffer,w,I)),!B.parse())throw Object.assign(new Error(`Parse error ${g}:${E.slice(0,B.e()).split("\n").length}:${B.e()-E.lastIndexOf("\n",B.e()-1)}`),{idx:B.e()});const L=[],k=[];for(;B.ri();)L.push({s:B.is(),e:B.ie(),ss:B.ss(),se:B.se(),d:B.id()});for(;B.re();)k.push(E.slice(B.es(),B.ee()));return [L,k,!!B.f()]}function Q(A,Q){const C=A.length;let B=0;for(;B<C;){const C=A.charCodeAt(B);Q[B++]=(255&C)<<8|C>>>8;}}function C(A,Q){const C=A.length;let B=0;for(;B<C;)Q[B]=A.charCodeAt(B++);}let B;const init=WebAssembly.compile((E="AGFzbQEAAAABWAxgAX8Bf2AEf39/fwBgAn9/AGAAAX9gAABgBn9/f39/fwF/YAR/f39/AX9gA39/fwF/YAd/f39/f39/AX9gBX9/f39/AX9gAn9/AX9gCH9/f39/f39/AX8DLy4AAQIDAwMDAwMDAwMDAwAEBAAFBAQAAAAABAQEBAQABQYHCAkKCwMCAAAKAwgLBAUBcAEBAQUDAQABBg8CfwFB8PAAC38AQfDwAAsHWg8GbWVtb3J5AgACc2EAAAFlAAMCaXMABAJpZQAFAnNzAAYCc2UABwJpZAAIAmVzAAkCZWUACgJyaQALAnJlAAwBZgANBXBhcnNlAA4LX19oZWFwX2Jhc2UDAQqjMy5oAQF/QQAgADYCtAhBACgCkAgiASAAQQF0aiIAQQA7AQBBACAAQQJqIgA2ArgIQQAgADYCvAhBAEEANgKUCEEAQQA2AqQIQQBBADYCnAhBAEEANgKYCEEAQQA2AqwIQQBBADYCoAggAQudAQECf0EAKAKkCCIEQRRqQZQIIAQbQQAoArwIIgU2AgBBACAFNgKkCEEAIAQ2AqgIQQAgBUEYajYCvAggBSAANgIIAkACQEEAKAKICCADRw0AIAUgAjYCDAwBCwJAQQAoAoQIIANHDQAgBSACQQJqNgIMDAELIAVBACgCkAg2AgwLIAVBADYCFCAFIAM2AhAgBSACNgIEIAUgATYCAAtIAQF/QQAoAqwIIgJBCGpBmAggAhtBACgCvAgiAjYCAEEAIAI2AqwIQQAgAkEMajYCvAggAkEANgIIIAIgATYCBCACIAA2AgALCABBACgCwAgLFQBBACgCnAgoAgBBACgCkAhrQQF1CxUAQQAoApwIKAIEQQAoApAIa0EBdQsVAEEAKAKcCCgCCEEAKAKQCGtBAXULFQBBACgCnAgoAgxBACgCkAhrQQF1CzsBAX8CQEEAKAKcCCgCECIAQQAoAoQIRw0AQX8PCwJAIABBACgCiAhHDQBBfg8LIABBACgCkAhrQQF1CxUAQQAoAqAIKAIAQQAoApAIa0EBdQsVAEEAKAKgCCgCBEEAKAKQCGtBAXULJQEBf0EAQQAoApwIIgBBFGpBlAggABsoAgAiADYCnAggAEEARwslAQF/QQBBACgCoAgiAEEIakGYCCAAGygCACIANgKgCCAAQQBHCwgAQQAtAMQIC4UMAQV/IwBBgPAAayIBJABBAEEBOgDECEEAQf//AzsByghBAEEAKAKMCDYCzAhBAEEAKAKQCEF+aiICNgLgCEEAIAJBACgCtAhBAXRqIgM2AuQIQQBBADsBxghBAEEAOwHICEEAQQA6ANAIQQBBADYCwAhBAEEAOgCwCEEAIAFBgNAAajYC1AhBACABQYAQajYC2AhBAEEAOgDcCAJAAkACQANAQQAgAkECaiIENgLgCAJAAkACQAJAIAIgA08NACAELwEAIgNBd2pBBUkNAyADQZt/aiIFQQRNDQEgA0EgRg0DAkAgA0EvRg0AIANBO0YNAwwGCwJAIAIvAQQiBEEqRg0AIARBL0cNBhAPDAQLEBAMAwtBACEDIAQhAkEALQCwCA0GDAULAkACQCAFDgUBBQUFAAELIAQQEUUNASACQQRqQe0AQfAAQe8AQfIAQfQAEBJFDQEQEwwBC0EALwHICA0AIAQQEUUNACACQQRqQfgAQfAAQe8AQfIAQfQAEBJFDQAQFEEALQDECA0AQQBBACgC4AgiAjYCzAgMBAtBAEEAKALgCDYCzAgLQQAoAuQIIQNBACgC4AghAgwACwtBACACNgLgCEEAQQA6AMQICwNAQQAgAkECaiIDNgLgCAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCACQQAoAuQITw0AIAMvAQAiBEF3akEFSQ0OIARBYGoiBUEJTQ0BIARBoH9qIgVBCU0NAgJAAkACQCAEQYV/aiIDQQJNDQAgBEEvRw0QIAIvAQQiAkEqRg0BIAJBL0cNAhAPDBELAkACQCADDgMAEQEACwJAQQAoAswIIgQvAQBBKUcNAEEAKAKkCCICRQ0AIAIoAgQgBEcNAEEAQQAoAqgIIgI2AqQIAkAgAkUNACACQQA2AhQMAQtBAEEANgKUCAsgAUEALwHICCICakEALQDcCDoAAEEAIAJBAWo7AcgIQQAoAtgIIAJBAnRqIAQ2AgBBAEEAOgDcCAwQC0EALwHICCICRQ0JQQAgAkF/aiIDOwHICAJAIAJBAC8ByggiBEcNAEEAQQAvAcYIQX9qIgI7AcYIQQBBACgC1AggAkH//wNxQQF0ai8BADsByggMCAsgBEH//wNGDQ8gA0H//wNxIARJDQkMDwsQEAwPCwJAAkACQAJAQQAoAswIIgQvAQAiAhAVRQ0AIAJBVWoiA0EDSw0CAkACQAJAIAMOBAEFAgABCyAEQX5qLwEAQVBqQf//A3FBCkkNAwwECyAEQX5qLwEAQStGDQIMAwsgBEF+ai8BAEEtRg0BDAILAkAgAkH9AEYNACACQSlHDQFBACgC2AhBAC8ByAhBAnRqKAIAEBZFDQEMAgtBACgC2AhBAC8ByAgiA0ECdGooAgAQFw0BIAEgA2otAAANAQsgBBAYDQAgAkUNAEEBIQQgAkEvRkEALQDQCEEAR3FFDQELEBlBACEEC0EAIAQ6ANAIDA0LQQAvAcoIQf//A0ZBAC8ByAhFcUEALQCwCEVxIQMMDwsgBQ4KDAsBCwsLCwIHBAwLIAUOCgIKCgcKCQoKCggCCxAaDAkLEBsMCAsQHAwHC0EALwHICCICDQELEB1BACEDDAgLQQAgAkF/aiIEOwHICEEAKAKkCCICRQ0EIAIoAhBBACgC2AggBEH//wNxQQJ0aigCAEcNBCACIAM2AgQMBAtBAEEALwHICCICQQFqOwHICEEAKALYCCACQQJ0akEAKALMCDYCAAwDCyADEBFFDQIgAi8BCkHzAEcNAiACLwEIQfMARw0CIAIvAQZB4QBHDQIgAi8BBEHsAEcNAgJAAkAgAi8BDCIEQXdqIgJBF0sNAEEBIAJ0QZ+AgARxDQELIARBoAFHDQMLQQBBAToA3AgMAgsgAxARRQ0BIAJBBGpB7QBB8ABB7wBB8gBB9AAQEkUNARATDAELQQAvAcgIDQAgAxARRQ0AIAJBBGpB+ABB8ABB7wBB8gBB9AAQEkUNABAUC0EAQQAoAuAINgLMCAtBACgC4AghAgwACwsgAUGA8ABqJAAgAwtQAQR/QQAoAuAIQQJqIQBBACgC5AghAQJAA0AgACICQX5qIAFPDQEgAkECaiEAIAIvAQBBdmoiA0EDSw0AIAMOBAEAAAEBCwtBACACNgLgCAt3AQJ/QQBBACgC4AgiAEECajYC4AggAEEGaiEAQQAoAuQIIQEDQAJAAkACQCAAQXxqIAFPDQAgAEF+ai8BAEEqRw0CIAAvAQBBL0cNAkEAIABBfmo2AuAIDAELIABBfmohAAtBACAANgLgCA8LIABBAmohAAwACwsdAAJAQQAoApAIIABHDQBBAQ8LIABBfmovAQAQHgs/AQF/QQAhBgJAIAAvAQggBUcNACAALwEGIARHDQAgAC8BBCADRw0AIAAvAQIgAkcNACAALwEAIAFGIQYLIAYL6QIBBH9BAEEAKALgCCIAQQxqIgE2AuAIAkACQAJAAkACQBAmIgJBWWoiA0EHTQ0AIAJBIkYNAiACQfsARg0CDAELAkACQCADDggDAQIDAgICAAMLQQBBACgC4AhBAmo2AuAIECZB7QBHDQNBACgC4AgiAy8BBkHhAEcNAyADLwEEQfQARw0DIAMvAQJB5QBHDQNBACgCzAgvAQBBLkYNAyAAIAAgA0EIakEAKAKICBABDwtBACgC2AhBAC8ByAgiA0ECdGogADYCAEEAIANBAWo7AcgIQQAoAswILwEAQS5GDQIgAEEAKALgCEECakEAIAAQAQ8LQQAoAuAIIAFGDQELQQAvAcgIDQFBACgC4AghA0EAKALkCCEBAkADQCADIAFPDQECQAJAIAMvAQAiAkEnRg0AIAJBIkcNAQsgACACECcPC0EAIANBAmoiAzYC4AgMAAsLEB0LDwtBAEEAKALgCEF+ajYC4AgLiAYBBH9BAEEAKALgCCIAQQxqIgE2AuAIECYhAgJAAkACQAJAAkACQEEAKALgCCIDIAFHDQAgAhAoRQ0BCwJAAkACQAJAIAJBn39qIgFBC00NAAJAAkAgAkEqRg0AIAJB9gBGDQUgAkH7AEcNA0EAIANBAmo2AuAIECYhA0EAKALgCCEBA0AgA0H//wNxECkaQQAoAuAIIQIQJhoCQCABIAIQKiIDQSxHDQBBAEEAKALgCEECajYC4AgQJiEDC0EAKALgCCECAkAgA0H9AEYNACACIAFGDQwgAiEBIAJBACgC5AhNDQEMDAsLQQAgAkECajYC4AgMAQtBACADQQJqNgLgCBAmGkEAKALgCCICIAIQKhoLECYhAgwBCyABDgwEAAEGAAUAAAAAAAIEC0EAKALgCCEDAkAgAkHmAEcNACADLwEGQe0ARw0AIAMvAQRB7wBHDQAgAy8BAkHyAEcNAEEAIANBCGo2AuAIIAAQJhAnDwtBACADQX5qNgLgCAwCCwJAIAMvAQhB8wBHDQAgAy8BBkHzAEcNACADLwEEQeEARw0AIAMvAQJB7ABHDQAgAy8BChAeRQ0AQQAgA0EKajYC4AgQJiECQQAoAuAIIQMgAhApGiADQQAoAuAIEAJBAEEAKALgCEF+ajYC4AgPC0EAIANBBGoiAzYC4AgLQQAgA0EEaiICNgLgCEEAQQA6AMQIA0BBACACQQJqNgLgCBAmIQJBACgC4AghAwJAAkAgAhApIgJBPUYNACACQfsARg0AIAJB2wBHDQELQQBBACgC4AhBfmo2AuAIDwtBACgC4AgiAiADRg0BIAMgAhACECYhA0EAKALgCCECIANBLEYNAAtBACACQX5qNgLgCA8LDwtBACADQQpqNgLgCBAmGkEAKALgCCEDC0EAIANBEGo2AuAIAkAQJiICQSpHDQBBAEEAKALgCEECajYC4AgQJiECC0EAKALgCCEDIAIQKRogA0EAKALgCBACQQBBACgC4AhBfmo2AuAIDwsgAyADQQ5qEAIPCxAdC3UBAX8CQAJAIABBX2oiAUEFSw0AQQEgAXRBMXENAQsgAEFGakH//wNxQQZJDQAgAEFYakH//wNxQQdJIABBKUdxDQACQCAAQaV/aiIBQQNLDQAgAQ4EAQAAAQELIABB/QBHIABBhX9qQf//A3FBBElxDwtBAQs9AQF/QQEhAQJAIABB9wBB6ABB6QBB7ABB5QAQHw0AIABB5gBB7wBB8gAQIA0AIABB6QBB5gAQISEBCyABC60BAQN/QQEhAQJAAkACQAJAAkACQAJAIAAvAQAiAkFFaiIDQQNNDQAgAkGbf2oiA0EDTQ0BIAJBKUYNAyACQfkARw0CIABBfmpB5gBB6QBB7gBB4QBB7ABB7AAQIg8LIAMOBAIBAQUCCyADDgQCAAADAgtBACEBCyABDwsgAEF+akHlAEHsAEHzABAgDwsgAEF+akHjAEHhAEH0AEHjABAjDwsgAEF+ai8BAEE9RgvtAwECf0EAIQECQCAALwEAQZx/aiICQRNLDQACQAJAAkACQAJAAkACQAJAIAIOFAABAggICAgICAgDBAgIBQgGCAgHAAsgAEF+ai8BAEGXf2oiAkEDSw0HAkACQCACDgQACQkBAAsgAEF8akH2AEHvABAhDwsgAEF8akH5AEHpAEHlABAgDwsgAEF+ai8BAEGNf2oiAkEBSw0GAkACQCACDgIAAQALAkAgAEF8ai8BACICQeEARg0AIAJB7ABHDQggAEF6akHlABAkDwsgAEF6akHjABAkDwsgAEF8akHkAEHlAEHsAEHlABAjDwsgAEF+ai8BAEHvAEcNBSAAQXxqLwEAQeUARw0FAkAgAEF6ai8BACICQfAARg0AIAJB4wBHDQYgAEF4akHpAEHuAEHzAEH0AEHhAEHuABAiDwsgAEF4akH0AEH5ABAhDwtBASEBIABBfmoiAEHpABAkDQQgAEHyAEHlAEH0AEH1AEHyABAfDwsgAEF+akHkABAkDwsgAEF+akHkAEHlAEHiAEH1AEHnAEHnAEHlABAlDwsgAEF+akHhAEH3AEHhAEHpABAjDwsCQCAAQX5qLwEAIgJB7wBGDQAgAkHlAEcNASAAQXxqQe4AECQPCyAAQXxqQfQAQegAQfIAECAhAQsgAQuDAQEDfwNAQQBBACgC4AgiAEECaiIBNgLgCAJAAkACQCAAQQAoAuQITw0AIAEvAQAiAUGlf2oiAkEBTQ0CAkAgAUF2aiIAQQNNDQAgAUEvRw0EDAILIAAOBAADAwAACxAdCw8LAkACQCACDgIBAAELQQAgAEEEajYC4AgMAQsQKxoMAAsLkQEBBH9BACgC4AghAEEAKALkCCEBAkADQCAAIgJBAmohACACIAFPDQECQCAALwEAIgNB3ABGDQACQCADQXZqIgJBA00NACADQSJHDQJBACAANgLgCA8LIAIOBAIBAQICCyACQQRqIQAgAi8BBEENRw0AIAJBBmogACACLwEGQQpGGyEADAALC0EAIAA2AuAIEB0LkQEBBH9BACgC4AghAEEAKALkCCEBAkADQCAAIgJBAmohACACIAFPDQECQCAALwEAIgNB3ABGDQACQCADQXZqIgJBA00NACADQSdHDQJBACAANgLgCA8LIAIOBAIBAQICCyACQQRqIQAgAi8BBEENRw0AIAJBBmogACACLwEGQQpGGyEADAALC0EAIAA2AuAIEB0LyQEBBX9BACgC4AghAEEAKALkCCEBA0AgACICQQJqIQACQAJAIAIgAU8NACAALwEAIgNBpH9qIgRBBE0NASADQSRHDQIgAi8BBEH7AEcNAkEAQQAvAcYIIgBBAWo7AcYIQQAoAtQIIABBAXRqQQAvAcoIOwEAQQAgAkEEajYC4AhBAEEALwHICEEBaiIAOwHKCEEAIAA7AcgIDwtBACAANgLgCBAdDwsCQAJAIAQOBQECAgIAAQtBACAANgLgCA8LIAJBBGohAAwACws1AQF/QQBBAToAsAhBACgC4AghAEEAQQAoAuQIQQJqNgLgCEEAIABBACgCkAhrQQF1NgLACAs0AQF/QQEhAQJAIABBd2pB//8DcUEFSQ0AIABBgAFyQaABRg0AIABBLkcgABAocSEBCyABC0kBA39BACEGAkAgAEF4aiIHQQAoApAIIghJDQAgByABIAIgAyAEIAUQEkUNAAJAIAcgCEcNAEEBDwsgAEF2ai8BABAeIQYLIAYLWQEDf0EAIQQCQCAAQXxqIgVBACgCkAgiBkkNACAALwEAIANHDQAgAEF+ai8BACACRw0AIAUvAQAgAUcNAAJAIAUgBkcNAEEBDwsgAEF6ai8BABAeIQQLIAQLTAEDf0EAIQMCQCAAQX5qIgRBACgCkAgiBUkNACAALwEAIAJHDQAgBC8BACABRw0AAkAgBCAFRw0AQQEPCyAAQXxqLwEAEB4hAwsgAwtLAQN/QQAhBwJAIABBdmoiCEEAKAKQCCIJSQ0AIAggASACIAMgBCAFIAYQLEUNAAJAIAggCUcNAEEBDwsgAEF0ai8BABAeIQcLIAcLZgEDf0EAIQUCQCAAQXpqIgZBACgCkAgiB0kNACAALwEAIARHDQAgAEF+ai8BACADRw0AIABBfGovAQAgAkcNACAGLwEAIAFHDQACQCAGIAdHDQBBAQ8LIABBeGovAQAQHiEFCyAFCz0BAn9BACECAkBBACgCkAgiAyAASw0AIAAvAQAgAUcNAAJAIAMgAEcNAEEBDwsgAEF+ai8BABAeIQILIAILTQEDf0EAIQgCQCAAQXRqIglBACgCkAgiCkkNACAJIAEgAiADIAQgBSAGIAcQLUUNAAJAIAkgCkcNAEEBDwsgAEFyai8BABAeIQgLIAgLdgEDf0EAKALgCCEAAkADQAJAIAAvAQAiAUF3akEFSQ0AIAFBIEYNACABQaABRg0AIAFBL0cNAgJAIAAvAQIiAEEqRg0AIABBL0cNAxAPDAELEBALQQBBACgC4AgiAkECaiIANgLgCCACQQAoAuQISQ0ACwsgAQtYAAJAAkAgAUEiRg0AIAFBJ0cNAUEAKALgCCEBEBsgACABQQJqQQAoAuAIQQAoAoQIEAEPC0EAKALgCCEBEBogACABQQJqQQAoAuAIQQAoAoQIEAEPCxAdC2gBAn9BASEBAkACQCAAQV9qIgJBBUsNAEEBIAJ0QTFxDQELIABB+P8DcUEoRg0AIABBRmpB//8DcUEGSQ0AAkAgAEGlf2oiAkEDSw0AIAJBAUcNAQsgAEGFf2pB//8DcUEESSEBCyABC20BAn8CQAJAA0ACQCAAQf//A3EiAUF3aiICQRdLDQBBASACdEGfgIAEcQ0CCyABQaABRg0BIAAhAiABECgNAkEAIQJBAEEAKALgCCIAQQJqNgLgCCAALwECIgANAAwCCwsgACECCyACQf//A3ELXAECfwJAQQAoAuAIIgIvAQAiA0HhAEcNAEEAIAJBBGo2AuAIECYhAkEAKALgCCEAIAIQKRpBACgC4AghARAmIQNBACgC4AghAgsCQCACIABGDQAgACABEAILIAMLiQEBBX9BACgC4AghAEEAKALkCCEBA38gAEECaiECAkACQCAAIAFPDQAgAi8BACIDQaR/aiIEQQFNDQEgAiEAIANBdmoiA0EDSw0CIAIhACADDgQAAgIAAAtBACACNgLgCBAdQQAPCwJAAkAgBA4CAQABC0EAIAI2AuAIQd0ADwsgAEEEaiEADAALC0kBAX9BACEHAkAgAC8BCiAGRw0AIAAvAQggBUcNACAALwEGIARHDQAgAC8BBCADRw0AIAAvAQIgAkcNACAALwEAIAFGIQcLIAcLUwEBf0EAIQgCQCAALwEMIAdHDQAgAC8BCiAGRw0AIAAvAQggBUcNACAALwEGIARHDQAgAC8BBCADRw0AIAAvAQIgAkcNACAALwEAIAFGIQgLIAgLCx8CAEGACAsCAAAAQYQICxABAAAAAgAAAAAEAABwOAAA","function"==typeof atob?Uint8Array.from(atob(E),A=>A.charCodeAt(0)):Buffer.from(E,"base64"))).then(WebAssembly.instantiate).then(({exports:A})=>{B=A;});var E;

  let id = 0;
  const registry = {};

  async function loadAll (load, seen) {
    if (load.b || seen[load.u])
      return;
    seen[load.u] = 1;
    await load.L;
    return Promise.all(load.d.map(dep => loadAll(dep, seen)));
  }

  let waitingForImportMapsInterval;
  let firstTopLevelProcess = true;
  async function topLevelLoad (url, source) {
    if (waitingForImportMapsInterval > 0) {
      clearTimeout(waitingForImportMapsInterval);
      waitingForImportMapsInterval = 0;
    }
    if (firstTopLevelProcess) {
      firstTopLevelProcess = false;
      processScripts();
    }
    await importMapPromise;
    await init;
    const load = getOrCreateLoad(url, source);
    const seen = {};
    await loadAll(load, seen);
    lastLoad = undefined;
    resolveDeps(load, seen);
    const module = await dynamicImport(load.b);
    // if the top-level load is a shell, run its update function
    if (load.s)
      (await dynamicImport(load.s)).u$_(module);
    return module;
  }

  async function importShim$1 (id, parentUrl) {
    return topLevelLoad(resolve(id, parentUrl || baseUrl));
  }

  self.importShim = importShim$1;

  const meta = {};

  const edge = navigator.userAgent.match(/Edge\/\d\d\.\d+$/);

  async function importMetaResolve (id, parentUrl = this.url) {
    await importMapPromise;
    return resolve(id, `${parentUrl}`);
  }

  Object.defineProperties(importShim$1, {
    m: { value: meta },
    l: { value: undefined, writable: true },
    e: { value: undefined, writable: true }
  });
  importShim$1.fetch = url => fetch(url);
  importShim$1.skip = /^https?:\/\/(cdn\.pika\.dev|dev\.jspm\.io|jspm\.dev)\//;
  importShim$1.load = processScripts;
  importShim$1.onerror = (e) => {
    throw e;
  };

  let lastLoad;
  function resolveDeps (load, seen) {
    if (load.b || !seen[load.u])
      return;
    seen[load.u] = 0;

    for (const dep of load.d)
      resolveDeps(dep, seen);

    // "execution"
    const source = load.S;
    // edge doesnt execute sibling in order, so we fix this up by ensuring all previous executions are explicit dependencies
    let resolvedSource = edge && lastLoad ? `import '${lastLoad}';` : '';

    const [imports] = load.a;

    if (!imports.length) {
      resolvedSource += source;
    }
    else {
      // once all deps have loaded we can inline the dependency resolution blobs
      // and define this blob
      let lastIndex = 0, depIndex = 0;
      for (const { s: start, e: end, d: dynamicImportIndex } of imports) {
        // dependency source replacements
        if (dynamicImportIndex === -1) {
          const depLoad = load.d[depIndex++];
          let blobUrl = depLoad.b;
          if (!blobUrl) {
            // circular shell creation
            if (!(blobUrl = depLoad.s)) {
              blobUrl = depLoad.s = createBlob(`export function u$_(m){${
                depLoad.a[1].map(
                  name => name === 'default' ? `$_default=m.default` : `${name}=m.${name}`
                ).join(',')
              }}${
                depLoad.a[1].map(name =>
                  name === 'default' ? `let $_default;export{$_default as default}` : `export let ${name}`
                ).join(';')
              }\n//# sourceURL=${depLoad.r}?cycle`);
            }
          }
          // circular shell execution
          else if (depLoad.s) {
            resolvedSource += source.slice(lastIndex, start - 1) + '/*' + source.slice(start - 1, end + 1) + '*/' + source.slice(start - 1, start) + blobUrl + source[end] + `;import*as m$_${depIndex} from'${depLoad.b}';import{u$_ as u$_${depIndex}}from'${depLoad.s}';u$_${depIndex}(m$_${depIndex})`;
            lastIndex = end + 1;
            depLoad.s = undefined;
            continue;
          }
          resolvedSource += source.slice(lastIndex, start - 1) + '/*' + source.slice(start - 1, end + 1) + '*/' + source.slice(start - 1, start) + blobUrl;
          lastIndex = end;
        }
        // import.meta
        else if (dynamicImportIndex === -2) {
          meta[load.r] = { url: load.r, resolve: importMetaResolve };
          resolvedSource += source.slice(lastIndex, start) + 'importShim.m[' + JSON.stringify(load.r) + ']';
          lastIndex = end;
        }
        // dynamic import
        else {
          resolvedSource += source.slice(lastIndex, dynamicImportIndex + 6) + 'Shim(' + source.slice(start, end) + ', ' + JSON.stringify(load.r);
          lastIndex = end;
        }
      }

      resolvedSource += source.slice(lastIndex);
    }

    let sourceMappingResolved = '';
    const sourceMappingIndex = resolvedSource.lastIndexOf('//# sourceMappingURL=');
    if (sourceMappingIndex > -1) {
      const sourceMappingEnd = resolvedSource.indexOf('\n',sourceMappingIndex);
      const sourceMapping = resolvedSource.slice(sourceMappingIndex, sourceMappingEnd > -1 ? sourceMappingEnd : undefined);
      sourceMappingResolved = `\n//# sourceMappingURL=` + resolveUrl(sourceMapping.slice(21), load.r);
    }
    load.b = lastLoad = createBlob(resolvedSource + sourceMappingResolved + '\n//# sourceURL=' + load.r);
    load.S = undefined;
  }

  function getOrCreateLoad (url, source) {
    let load = registry[url];
    if (load)
      return load;

    load = registry[url] = {
      // url
      u: url,
      // response url
      r: undefined,
      // fetchPromise
      f: undefined,
      // source
      S: undefined,
      // linkPromise
      L: undefined,
      // analysis
      a: undefined,
      // deps
      d: undefined,
      // blobUrl
      b: undefined,
      // shellUrl
      s: undefined,
    };

    const depcache = importMap.depcache[url];
    if (depcache)
      depcache.forEach(depUrl => getOrCreateLoad(resolve(depUrl, url)));

    load.f = (async () => {
      if (!source) {
        const res = await importShim$1.fetch(url);
        if (!res.ok)
          throw new Error(`${res.status} ${res.statusText} ${res.url}`);
        load.r = res.url;
        const contentType = res.headers.get('content-type');
        if (contentType.match(/^(text|application)\/(x-)?javascript(;|$)/))
          source = await res.text();
        else
          throw new Error(`Unknown Content-Type "${contentType}"`);
      }
      try {
        load.a = parse(source, load.u);
      }
      catch (e) {
        console.warn(e);
        load.a = [[], []];
      }
      load.S = source;
      return load.a[0].filter(d => d.d === -1).map(d => source.slice(d.s, d.e));
    })();

    load.L = load.f.then(async deps => {
      load.d = await Promise.all(deps.map(async depId => {
        const resolved = resolve(depId, load.r || load.u);
        if (importShim$1.skip.test(resolved))
          return { b: resolved };
        const depLoad = getOrCreateLoad(resolved);
        await depLoad.f;
        return depLoad;
      }));
    });

    return load;
  }

  let importMap = { imports: {}, scopes: {}, depcache: {} };
  let importMapPromise = resolvedPromise;

  if (hasDocument) {
    processScripts();
    waitingForImportMapsInterval = setInterval(processScripts, 20);
  }

  async function processScripts () {
    if (waitingForImportMapsInterval > 0 && document.readyState !== 'loading') {
      clearTimeout(waitingForImportMapsInterval);
      waitingForImportMapsInterval = 0;
    }
    for (const script of document.querySelectorAll('script[type="module-shim"],script[type="importmap-shim"]')) {
      if (script.ep) // ep marker = script processed
        return;
      if (script.type === 'module-shim') {
        await topLevelLoad(script.src || `${baseUrl}?${id++}`, !script.src && script.innerHTML).catch(e => importShim$1.onerror(e));
      }
      else {
        importMapPromise = importMapPromise.then(async () =>
          importMap = resolveAndComposeImportMap(script.src ? await (await fetch(script.src)).json() : JSON.parse(script.innerHTML), script.src || baseUrl, importMap)
        );
      }
      script.ep = true;
    }
  }

  function resolve (id, parentUrl) {
    return resolveImportMap(importMap, resolveIfNotPlainOrUrl(id, parentUrl) || id, parentUrl) || throwUnresolved(id, parentUrl);
  }

  function throwUnresolved (id, parentUrl) {
    throw Error("Unable to resolve specifier '" + id + (parentUrl ? "' from " + parentUrl : "'"));
  }

}());
