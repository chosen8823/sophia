# -*- mode: python ; coding: utf-8 -*-

a = Analysis(
    ['sophiael_main.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('config.toml', '.'),
        ('README.md', '.'),
    ],
    hiddenimports=[
        'flask',
        'flask_cors',
        'sqlalchemy',
        'pydantic',
        'yaml',
        'logging',
        'json',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'matplotlib',
        'scipy',
        'pandas',
        'tensorflow',
        'torch',
        'opencv',
    ],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='SophiaelAI',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='sophiael_icon.ico' if 'sophiael_icon.ico' else None,
)