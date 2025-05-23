// Copyright (c) 2018, Compiler Explorer Authors
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

import {beforeAll, describe, expect, it} from 'vitest';

import {DMDCompiler} from '../lib/compilers/dmd.js';
import {LDCCompiler} from '../lib/compilers/ldc.js';
import {LanguageKey} from '../types/languages.interfaces.js';

import {makeCompilationEnvironment, makeFakeCompilerInfo} from './utils.js';

const languages = {
    d: {id: 'd' as LanguageKey},
};

describe('D', () => {
    let ce;
    const info = {
        exe: '/dev/null',
        remote: {
            target: 'foo',
            path: 'bar',
            cmakePath: 'cmake',
            basePath: '/',
        },
        lang: languages.d.id,
    };

    beforeAll(() => {
        ce = makeCompilationEnvironment({languages});
    });

    it('LDC should not allow -run parameter', () => {
        const compiler = new LDCCompiler(makeFakeCompilerInfo(info), ce);
        expect(compiler.filterUserOptions(['hello', '-run', '--something'])).toEqual(['hello', '--something']);
    });
    it('DMD should not allow -run parameter', () => {
        const compiler = new DMDCompiler(makeFakeCompilerInfo(info), ce);
        expect(compiler.filterUserOptions(['hello', '-run', '--something'])).toEqual(['hello', '--something']);
    });

    it('LDC supports AST output since version 1.4.0', () => {
        const compiler = new LDCCompiler(makeFakeCompilerInfo(info), ce);
        expect(compiler.couldSupportASTDump('LDC - the LLVM D compiler (1.3.0)')).toEqual(false);
        expect(compiler.couldSupportASTDump('LDC - the LLVM D compiler (1.4.0)')).toEqual(true);
        expect(compiler.couldSupportASTDump('LDC - the LLVM D compiler (1.8.0git-d54d25b-dirty)')).toEqual(true);
        expect(compiler.couldSupportASTDump('LDC - the LLVM D compiler (1.10.0)')).toEqual(true);
    });
});
