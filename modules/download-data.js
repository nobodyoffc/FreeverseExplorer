// Release catalog for the download page.
// Each family groups the builds of one app across platforms. To publish a new
// release, update the build's version/tag/date/assets/changes here.
// Assets without `href` are downloaded from the GitHub release of `repo`/`tag`.

export const GITHUB_OWNER = 'nobodyoffc';

// Signing identities shared by several builds
export const SIGNING = {
    android: {
        subject: 'CN=FJYN3D7x4yiLF692WUAe7Vfo2nQpYDNrC7, O=Freer',
        sha256: '2d:82:0c:25:54:60:94:56:95:44:36:14:10:e3:04:44:b4:70:b3:89:02:3b:b1:ad:ba:80:1f:97:cf:e7:f0:2d'
    },
    macTeam: '5768V787GP'
};

export const RELEASE_FAMILIES = [
    {
        id: 'freer',
        name: 'Freer',
        tagline: {
            en: 'Basic life skills for flyers living in the free universe: wallet, identity, messaging, voice calls and meetings.',
            zh: '飞人在自由宇宙中生活的基本技能：钱包、身份、通讯、语音通话与会议。'
        },
        builds: [
            {
                platform: 'android',
                title: 'Freer for Android',
                repo: 'Freer',
                version: '3.4.0',
                tag: 'v3.4.0',
                date: '2026-10-30',
                prerelease: false,
                requirements: { en: 'Android 9.0 (API 28) or newer', zh: 'Android 9.0（API 28）或更高版本' },
                notice: {
                    en: 'Proofs and tokens follow the new FEIP rules: proof issues and transfers made with 3.3.0 or earlier are ignored, so upgrade before issuing or transferring proofs. From 3.2.2 or 3.3.0: installs in place, keys and data stay. From 3.1.1 or earlier: uninstall first, which erases the keys and data on the device; export your private keys, CIDs and secrets before uninstalling.',
                    zh: '存证和通证遵循新的 FEIP 规则：3.3.0 及更早版本发出的存证签发和转让会被忽略，请先升级再签发或转让存证。从 3.2.2 或 3.3.0 升级：直接覆盖安装，密钥和数据保留。从 3.1.1 或更早版本升级：必须先卸载，卸载会清除设备上的密钥和数据；卸载前请先导出私钥、CID 和秘密。'
                },
                changes: {
                    en: [
                        'Proofs: issue to a first owner, a history page per proof, hidden proofs on their own page.',
                        'Tokens: closed tokens move to a read-only Closed page; history shows issueTo / transferTo as FID and amount.',
                        'Mail is now Cmail (Crypto Mail); reply heads show the original\'s time; notice fees in F, default sending limit 1 F.',
                        'Multisig: sign until there are enough signatures, then Send; merge several signed JSONs; at most 15 members.',
                        'Backups: a random export password is 128 bits, not written into the export, and shown once; exports carry no key name.',
                        'Servants: recover a prikey from the master\'s declaration record.',
                        'Create TX: lock days convert to block heights; locked outputs fixed.',
                        'Fixes: a crash on symkey receipt in Chinese, balance after send, stale managers after a login, Cmail badge after background sync.'
                    ],
                    zh: [
                        '存证：可签发给首位所有者，每个存证有历史页，已隐藏的存证单独成页。',
                        '通证：已关闭的通证移入只读的“已关闭”页；历史以 FID 和数量显示 issueTo / transferTo。',
                        '邮件更名为密信（Cmail）；回复头显示原信时间；通知费以 F 显示，默认发送上限 1 F。',
                        '多签：签名数足够后再发送；可合并多个已签名 JSON；成员最多 15 个。',
                        '备份：随机导出密码为 128 位，不写入导出数据，只显示一次；导出数据不含密钥名。',
                        '仆从：可从主 FID 的声明记录恢复私钥。',
                        '创建交易：锁定天数换算为区块高度；修复锁定输出。',
                        '修复：中文环境收到对称密钥时崩溃、发送后余额、登录后沿用旧身份的管理器、后台同步后密信角标未刷新。'
                    ]
                },
                signedWith: 'android',
                assets: [
                    { name: 'Freer-3.4.0.apk', size: 54844820, sha256: '3c8860392ff23eccc7565ec1de0cc95c7bd79a486f11e18b26b1f1a66c4a471a' }
                ]
            },
            {
                platform: 'mac',
                title: 'Freer for macOS',
                repo: 'freer-mac',
                version: '0.6',
                tag: 'v0.6',
                date: '2026-10-30',
                prerelease: true,
                requirements: { en: 'macOS 14.0 or later, Apple silicon only', zh: 'macOS 14.0 或更高版本，仅支持 Apple 芯片' },
                notice: {
                    en: 'Developer ID signed and notarized by Apple. Proofs and tokens follow the new FEIP rules: proof issues and transfers made with 0.5 or earlier are ignored, so upgrade before issuing or transferring proofs.',
                    zh: '已使用 Developer ID 签名并通过 Apple 公证。存证和通证遵循新的 FEIP 规则：0.5 及更早版本发出的存证签发和转让会被忽略，请先升级再签发或转让存证。'
                },
                changes: {
                    en: [
                        'Proofs: issue to a first owner; issueTo / transferTo named in the op, no payment output needed.',
                        'Tokens: a FID\'s history is searched by issueTo.fid / transferTo.fid.',
                        'Mail is now Cmail (Crypto Mail); replies open from a preset and add the original\'s time; default notice-fee limit 1 F.',
                        'Publish: texts from files; carve and read locas (FEIP21-25).',
                        'First-FCH board: an asker with a guide is funded, even at zero balance.',
                        'Release Sync ignores closed records and re-reads every manifest on Scan; registry Refresh and Return search the whole index.',
                        'Imports backups from Safe 2.5, Safe for macOS 1.1.1 and Freer 3.4.0, which no longer carry their random password.'
                    ],
                    zh: [
                        '存证：可签发给首位所有者；操作中写明 issueTo / transferTo，不再需要支付输出。',
                        '通证：按 issueTo.fid / transferTo.fid 查询 FID 的历史。',
                        '邮件更名为密信（Cmail）；回复从预设打开并附原信时间；通知费默认上限 1 F。',
                        '发布：文本从文件发布；可上链并读取 locas（FEIP21-25）。',
                        '新手求助：有引路人的求助者即使余额为零也会获得资助。',
                        '发布同步忽略已关闭的记录，扫描时重读全部清单；注册表的刷新和返回搜索整个索引。',
                        '可导入 Safe 2.5、Safe for macOS 1.1.1 和 Freer 3.4.0 的备份，这些备份不再包含随机密码。'
                    ]
                },
                assets: [
                    { name: 'Freer-0.6.dmg', size: 18551485, sha256: 'd325aed80df1de8ee8d80d6d5bb3b9421c6d0c92babe3fdda900461afb0d48da' }
                ]
            }
        ]
    },
    {
        id: 'safe',
        name: 'Safe',
        tagline: {
            en: 'Offline wallet for personal data security: keys, secrets, TOTP, multisig and transaction signing on an offline device.',
            zh: '用于个人数据安全的离线钱包：在离线设备上管理密钥、秘密、TOTP、多签及交易签名。'
        },
        builds: [
            {
                platform: 'android',
                title: 'Safe for Android',
                repo: 'Safe',
                version: '2.5',
                tag: 'v2.5',
                date: '2026-10-30',
                prerelease: false,
                requirements: { en: 'Android 9 (API 28) or later', zh: 'Android 9（API 28）或更高版本' },
                notice: {
                    en: 'Coming from 2.3 or older, the first unlock moves your vault to a new format; don\'t go back to an older version afterwards. Backups exported from 2.5 always ask for their password, since a random password is no longer in the file.',
                    zh: '从 2.3 或更早版本升级时，首次解锁会把保险库迁移到新格式，之后请勿回退到旧版本。2.5 导出的备份导入时总会要求输入密码，因为随机密码不再写入文件。'
                },
                changes: {
                    en: [
                        'A random export password is 128 bits and is not written into the export: it is shown once, as text and QR code, and the dialog closes only after you confirm you saved it.',
                        'Backups and password ciphers carry no key name, so a copy of the file no longer allows quick password guessing.',
                        'Adding keys is one Import Keys screen, as in Freer.',
                        'Fixes: import reports the number of keys saved; more dialogs in Chinese; the TOTP code shrinks to fit.'
                    ],
                    zh: [
                        '随机导出密码为 128 位，且不写入导出数据：只显示一次（文本和二维码），确认已保存后对话框才会关闭。',
                        '备份和密码密文不再含密钥名，拿到文件的人无法借此快速猜测密码。',
                        '添加密钥合并为一个“导入密钥”界面，与 Freer 一致。',
                        '修复：导入时报告已保存的密钥数；更多对话框已译为中文；TOTP 验证码会缩小以完整显示。'
                    ]
                },
                signedWith: 'android',
                assets: [
                    { name: 'Safe-2.5.apk', size: 48893301, sha256: '5c467e1b7ee842861935e3255ab58a3d997cb1da9f4f761be5b01027e8d78833' }
                ]
            },
            {
                platform: 'mac',
                title: 'Safe for macOS',
                repo: 'SafeForMac',
                version: '1.1.1',
                tag: 'v1.1.1',
                date: '2026-10-30',
                prerelease: false,
                requirements: { en: 'macOS 11 or later, Apple silicon (M1 or later)', zh: 'macOS 11 或更高版本，Apple 芯片（M1 及以上）' },
                notice: {
                    en: 'Developer ID signed and notarized by Apple: opens with no Gatekeeper warning. Coming from 1.0.x, the first unlock migrates the wallet (up to a minute); don\'t go back to 1.0.x afterwards.',
                    zh: '已使用 Developer ID 签名并通过 Apple 公证，打开时不会被系统拦截。从 1.0.x 升级时，首次解锁会迁移钱包（最多约一分钟），之后请勿回退到 1.0.x。'
                },
                changes: {
                    en: [
                        'A random export password is 128 bits and is not written into the export: it is shown once, as text and QR code, and the window stays open until you confirm you saved it.',
                        'Exports carry no key name, so a copy of the file no longer allows quick password guessing.',
                        'Reads key and secret backups from Android Safe 2.5; older backups still import.'
                    ],
                    zh: [
                        '随机导出密码为 128 位，且不写入导出数据：只显示一次（文本和二维码），确认已保存后窗口才会关闭。',
                        '导出数据不再含密钥名，拿到文件的人无法借此快速猜测密码。',
                        '可读取 Android Safe 2.5 的密钥和秘密备份；旧备份仍可导入。'
                    ]
                },
                assets: [
                    { name: 'Safe-1.1.1.dmg', size: 183796325, sha256: 'a6b533ddd6f0cec53aebafd66233a83d281868a24005ab2f82539a4bf37fa298' }
                ]
            }
        ]
    },
    {
        id: 'mycoins',
        name: 'MyCoins',
        tagline: {
            en: 'Multi-chain cryptocurrency management with the same private key.',
            zh: '用同一私钥管理多条链上的密码货币。'
        },
        builds: [
            {
                platform: 'android',
                title: 'MyCoins for Android',
                repo: 'MyCoins',
                version: '0.1.2',
                tag: 'v0.1.2',
                date: '2026-10-07',
                prerelease: false,
                requirements: null,
                notice: null,
                changes: {
                    en: [
                        'Private key backup tracking and reminders.',
                        'Choice of KDF for phrase-generated keys, QR scanning on Send, and Back/backup UI fixes (from v0.1.1).',
                        'Signed with the Freer release key (APK Signature Scheme v2 + v3).'
                    ],
                    zh: [
                        '私钥备份状态跟踪与提醒。',
                        '密语生成私钥可选择 KDF，发送页支持扫码，修复返回与备份界面问题（自 v0.1.1）。',
                        '使用 Freer 发布密钥签名（APK 签名方案 v2 + v3）。'
                    ]
                },
                signedWith: 'android',
                assets: [
                    { name: 'MyCoins-v0.1.2.apk', size: 93761678, sha256: '316ca745965b960b353ecc9a1abe58f0a6ef5d4cb7de0b35f8cc34d6bd4b64d6' }
                ]
            },
            {
                platform: 'mac',
                title: 'MyCoins for macOS',
                repo: 'MycoinsForMac',
                version: '0.1.4',
                tag: 'v0.1.4',
                date: '2026-10-06',
                prerelease: false,
                requirements: { en: 'macOS 11 Big Sur or later', zh: 'macOS 11 Big Sur 或更高版本' },
                notice: {
                    en: 'Signed with Developer ID and notarized by Apple: opens normally on first launch. If you installed v0.1.3, replace it with this version.',
                    zh: '已使用 Developer ID 签名并通过 Apple 公证，首次启动即可正常打开。如已安装 v0.1.3，请用此版本替换。'
                },
                changes: {
                    en: [
                        'Signed with Developer ID, notarized, and the ticket stapled to each DMG.',
                        'Hardened runtime with a camera entitlement so QR scanning still works.',
                        'No functional changes since v0.1.3: wallet core, balances, sending, private key backup, QR scanning.'
                    ],
                    zh: [
                        '使用 Developer ID 签名并公证，公证票据已附加到每个 DMG。',
                        '启用强化运行时，并授予相机权限以保证扫码可用。',
                        '功能与 v0.1.3 相同：钱包核心、余额、发送、私钥备份、二维码扫描。'
                    ]
                },
                assets: [
                    {
                        name: 'MyCoins_0.1.4_universal.dmg', size: 9689521, sha256: '4f94b6c00fe902f78188db42f6e88c97fcc3647e9c2b4f82eacc08ce94d71b6c',
                        label: { en: 'All Macs (Intel + Apple silicon)', zh: '所有 Mac（Intel + Apple 芯片）' }
                    },
                    {
                        name: 'MyCoins_0.1.4_aarch64.dmg', size: 4983475, sha256: '3ad3bc75e0cf34d9f9017236c91f2fc45e35765f821b3ca7ecf61c9eb7024410',
                        label: { en: 'Apple silicon only, smaller', zh: '仅 Apple 芯片，体积更小' }
                    }
                ]
            }
        ]
    },
    {
        id: 'qr',
        name: 'EasyQR / ScanQR',
        tagline: {
            en: 'Continuously scan or make multiple QR codes; long content is split across several codes.',
            zh: '连续扫描或生成多个二维码，长内容自动拆分到多个码中。'
        },
        builds: [
            {
                platform: 'android',
                title: 'EasyQR for Android',
                repo: 'EasyQR',
                version: '2.3',
                tag: 'v2.3',
                date: '2026-10-06',
                prerelease: false,
                requirements: null,
                notice: {
                    en: 'Signed with a new release key: uninstall 2.2 first, then install this APK.',
                    zh: '使用新的发布密钥签名：请先卸载 2.2，再安装此 APK。'
                },
                changes: {
                    en: [
                        'QR scanning uses ZXing + CameraX instead of ML Kit: the APK shrank from 29 MB to 6 MB.',
                        'Signed by the same signer as Freer and Safe.'
                    ],
                    zh: [
                        '扫码改用 ZXing + CameraX 替代 ML Kit，安装包从 29 MB 缩小到 6 MB。',
                        '与 Freer、Safe 使用同一签名者。'
                    ]
                },
                signedWith: 'android',
                assets: [
                    { name: 'easy-qr-2.3.apk', size: 6089456, sha256: '4647298873f11a0ec92ddc771f5d1a43fc309d240f2d18aac52b68f5b8ca7094' }
                ]
            },
            {
                platform: 'mac',
                title: 'ScanQR for macOS',
                repo: 'scanqr',
                version: '1.0',
                tag: 'v1.0',
                date: '2026-09-03',
                prerelease: false,
                requirements: { en: 'macOS 13 or later, Intel and Apple silicon', zh: 'macOS 13 或更高版本，支持 Intel 与 Apple 芯片' },
                notice: {
                    en: 'Not notarized: approve the first launch once (macOS 15+: System Settings → Privacy & Security → Open Anyway; macOS 14 and earlier: Control-click → Open). No Apple ID needed.',
                    zh: '未经公证：首次打开需放行一次（macOS 15+：系统设置 → 隐私与安全性 → 仍要打开；macOS 14 及以下：按住 Control 点按 → 打开）。无需 Apple ID。'
                },
                changes: {
                    en: [
                        'Universal binary: Apple silicon (arm64) + Intel (x86_64).',
                        'Signed with Developer ID; camera is used only to read QR codes.'
                    ],
                    zh: [
                        '通用二进制：Apple 芯片（arm64）+ Intel（x86_64）。',
                        '使用 Developer ID 签名；相机仅用于读取二维码。'
                    ]
                },
                assets: [
                    { name: 'ScanQR-1.0-universal.dmg', size: 388226, sha256: '935db18b09345ed3778395906d77880a717f35dc7425e90b39fa719a006633eb' }
                ]
            }
        ]
    },
    {
        id: 'freeverse',
        name: 'Freeverse',
        tagline: {
            en: 'Server and developer tools: chain and FEIP parsers, APIP and FAPI servers and clients, the FC-SDK library, and the explorer web app.',
            zh: '服务端与开发工具：链与 FEIP 解析器、APIP 与 FAPI 服务端和客户端、FC-SDK 库，以及浏览器网页应用。'
        },
        builds: [
            {
                platform: 'server',
                title: 'Freeverse',
                repo: 'Freeverse',
                version: '0.4.1',
                tag: 'v0.4.1',
                date: '2026-10-30',
                prerelease: true,
                requirements: {
                    en: 'Java 17+; ApipServer.war needs Tomcat 10+ (Jakarta Servlet); parsers and servers need Elasticsearch 8.8.0+. Run jars in an interactive terminal: they read the password from the console.',
                    zh: 'Java 17+；ApipServer.war 需要 Tomcat 10+（Jakarta Servlet）；解析器和服务端需要 Elasticsearch 8.8.0+。请在交互式终端中运行 jar，程序会从控制台读取密码。'
                },
                notice: {
                    en: 'Upgrading FeipParser from v0.3.1 or older needs a full reparse: FEIP rules and index mappings changed for the whole chain. Stop FeipParser and pause the FAPI/APIP servers, run Start New Parse from file, and restart the servers once it has caught up. FeipParser now reads config/FEIP_settings.json: rename FEIP_v2.1_settings.json before starting it.',
                    zh: '从 v0.3.1 或更早版本升级 FeipParser 需要全量重新解析：FEIP 规则和索引映射对全链生效。停止 FeipParser 并暂停 FAPI/APIP 服务端，选择“Start New Parse from file”，追上链后再启动服务端。FeipParser 现在读取 config/FEIP_settings.json：启动前请将 FEIP_v2.1_settings.json 改名。'
                },
                changes: {
                    en: [
                        'Apps show the release they were built for (e.g. Freeverse v0.4.1) instead of per-app version numbers.',
                        'Consensus (FEIP0): a malformed FID in any FID field invalidates the whole op; enforced for proof cosigners and team lists.',
                        'Consensus: from height 4,000,000 every FEIP op needs 1 cd; token deploy and proof issue no longer need ×100.',
                        'Consensus (FEIP14): proof owners are named in the op (issueTo, transferTo); tx outputs are ignored. FEIP20 token history drops the output-derived recipient.',
                        'FchParser re-syncs on its own when the fullnode rewrites the tip block file, instead of stopping on "Read Magic wrong".',
                        'FeipParser maps home as an object and skips a field Elasticsearch refuses instead of stopping.',
                        'FUDP: a peer that restarts and reconnects from the same address no longer has its first request time out.',
                        'FEIP7 renamed Cmail (Crypto Mail); FEIP21–25 gain locas, where to download a published work.'
                    ],
                    zh: [
                        '各程序显示其所属的发布版本（如 Freeverse v0.4.1），不再显示各自的版本号。',
                        '共识（FEIP0）：任何 FID 字段中出现格式错误的 FID，整个操作无效；已用于证明共签人和团队名单。',
                        '共识：从高度 4,000,000 起每个 FEIP 操作需要 1 cd；通证部署和证明发行不再需要 ×100。',
                        '共识（FEIP14）：证明的所有者由操作中的 issueTo、transferTo 指定，不再读取交易输出。FEIP20 通证历史去掉由输出推出的 recipient。',
                        '全节点重写最新区块文件时，FchParser 会自动重新同步，不再因 “Read Magic wrong” 停止。',
                        'FeipParser 将 home 映射为对象；Elasticsearch 拒绝某个字段时跳过该字段，不再停止。',
                        'FUDP：对方重启后从同一地址重新连接时，第一个请求不再超时。',
                        'FEIP7 更名为 Cmail（Crypto Mail）；FEIP21–25 新增 locas 字段，说明作品可从哪里下载。'
                    ]
                },
                assets: [
                    { name: 'FchParser.jar', size: 57817026, sha256: '72cc7c7f797740d3b986e8fcf41183dbbd758393085d5e377be5ff3e147234e1',
                      label: { en: 'Freecash chain parser: blocks, transactions, cash and inscriptions', zh: 'Freecash 链解析器：区块、交易、现金与刻字' } },
                    { name: 'FeipParser.jar', size: 57896232, sha256: '3f0f58f6f19d24aa64cd38ceee61c766444b64031b8a88480e921069456c0c07',
                      label: { en: 'FEIP parser: identity, organization and social data', zh: 'FEIP 解析器：身份、组织与社交数据' } },
                    { name: 'FapiServer.jar', size: 63169432, sha256: 'a114f1c25030ac3576f21f3caf31e60119a3e4430479a62bd009b8cfba66989e',
                      label: { en: 'FAPI server: API provider for Freer over FUDP', zh: 'FAPI 服务端：基于 FUDP 为 Freer 提供 API' } },
                    { name: 'FapiClient.jar', size: 63169432, sha256: '559e32881bea2341892d7215ba77d4ddeeeb92825832acc86db641a10807f9a0',
                      label: { en: 'FAPI client', zh: 'FAPI 客户端' } },
                    { name: 'ApipServer.war', size: 62194761, sha256: '5dbb6f9b1df0531658f099257b2d16f9cb8ec8f7d97f1c548087a199cc3056c8',
                      label: { en: 'APIP server (web app) for the Freeverse explorer over HTTP', zh: 'APIP 服务端（Web 应用），通过 HTTP 为 Freeverse 浏览器提供 API' } },
                    { name: 'ApipManager.jar', size: 57773428, sha256: '984e3359328b81be5b07611f97d3926ae9dd77ff0c66061efe0d08a8d72968b7',
                      label: { en: 'APIP manager: configure ApipServer before launching it', zh: 'APIP 管理器：启动 ApipServer 前配置参数' } },
                    { name: 'ApipClient.jar', size: 57750679, sha256: '2c26317d2f17102938b31c32068d910b34e9f7906e09362cee171574b237c0c6',
                      label: { en: 'APIP client', zh: 'APIP 客户端' } },
                    { name: 'CryptoSign.jar', size: 63169430, sha256: 'b10520865d29af1b5cfcb1c43c738339913c0cfcd2e9b9a2d0027fcf79083916',
                      label: { en: 'CryptoSign tool', zh: 'CryptoSign 工具' } },
                    { name: 'FC-SDK.jar', size: 63169403, sha256: '2192770f473d54018509ba9762b0e04971d1bf6d3dc95e2ed509159fd9d01a3c',
                      label: { en: 'FC-JDK library with all dependencies', zh: '含全部依赖的 FC-JDK 库' } },
                    { name: 'SHA256SUMS', size: 725, sha256: '645693ac19c97a72f0a73f3b89f86ee5830d232dea3bad94af8c04185ec0624a',
                      label: { en: 'Checksums: shasum -a 256 -c SHA256SUMS', zh: '校验文件：shasum -a 256 -c SHA256SUMS' } }
                ]
            },
            {
                platform: 'server',
                title: 'Freeverse Explorer',
                repo: 'FreeverseExplorer',
                version: '1.0',
                tag: 'v1.0',
                date: '2026-10-08',
                prerelease: false,
                requirements: {
                    en: 'Tomcat 9+. Unzip into Tomcat\'s webapps directory: it unpacks as ROOT and must be served at /. Restart Tomcat afterwards.',
                    zh: 'Tomcat 9+。解压到 Tomcat 的 webapps 目录：解压后为 ROOT，必须部署在根路径 /。解压后重启 Tomcat。'
                },
                notice: {
                    en: 'The explorer reads chain data from freecash.info and cid.cash. To use your own ApipServer instead, replace these two servers in ROOT/modules/api.js (SERVER_URL_HEADS) with its URL, for example https://your.domain/APIP.',
                    zh: '浏览器从 freecash.info 和 cid.cash 读取链上数据。如需使用你自己的 ApipServer，请在 ROOT/modules/api.js（SERVER_URL_HEADS）中把这两个服务器替换为它的地址，例如 https://your.domain/APIP。'
                },
                changes: {
                    en: [
                        'First release: the web front end of freecash.info, packaged to run on your own Tomcat.',
                        'Pages for news, squares and published text, images, sounds and videos; a hash tool and a node list.',
                        'Address links (/address/<FID>) are served by address.jsp.',
                        'apip.cash, which has expired, is no longer among the APIP servers.'
                    ],
                    zh: [
                        '首个版本：freecash.info 的网页前端，打包后可部署在你自己的 Tomcat 上。',
                        '新增新闻、广场以及已发布的文本、图片、声音和视频页面；新增哈希工具和节点列表。',
                        '地址链接（/address/<FID>）由 address.jsp 提供。',
                        '已过期的 apip.cash 不再列入 APIP 服务器。'
                    ]
                },
                assets: [
                    { name: 'FreeverseExplorer.zip', size: 501321, sha256: 'd094719ded2c2d4fed1a8706908580c998a4220099c9283beecd2be78bfa455e',
                      label: { en: 'The explorer web app: unzip into Tomcat webapps', zh: '浏览器网页应用：解压到 Tomcat 的 webapps 目录' } },
                    { name: 'SHA256SUMS', size: 88, sha256: '60ab91f2822960368c4243be9310fe52b80b52a6089e759ea40595881361331e',
                      label: { en: 'Checksums: shasum -a 256 -c SHA256SUMS', zh: '校验文件：shasum -a 256 -c SHA256SUMS' } }
                ]
            }
        ]
    }
];

// Full node files served from this site, plus the protocols (a GitHub release outside the app families)
export const OTHER_DOWNLOADS = [
    {
        title: { en: 'Freecash full node 1.0.5', zh: 'Freecash 全节点 1.0.5' },
        files: [
            { name: 'macOS', href: '/download/Freecash-1.0.5-MacOs.dmg', did: 'd1e14b1ec1bf6e4e04a72830f0e397b180e242c7bdc1cde65d992bf0803ace18' },
            { name: 'Windows x64', href: '/download/Freecash-1.0.5-win64.zip', did: 'a780853bc5e13b0e58c03e77436381e14f0171c6e87c1fba0ae4def1c4c03bd3' },
            { name: 'Linux (Docker)', href: '/download/Freecash_1.0.5-linux-docker.zip', did: '31b772b2628e44c3f3218a76e8b9bcc7bad7daab64992251dc6f03fc45a4049e' }
        ]
    },
    {
        title: { en: 'Protocols', zh: '协议文档' },
        files: [
            { name: 'Protocols.zip', size: 581113, sha256: '43a93f7d473238b8e1490c215790e2c41c940d5d4bf1e8563e4faa14d3eef5af',
              href: 'https://github.com/nobodyoffc/Freeverse/releases/download/protocols-2026-10-30/Protocols.zip',
              label: { en: 'Protocol specifications, 2026-10-30 (FAPI, FBP, FBSP, FEIP, FTSP, FUDP, FVEP, IM)', zh: '协议规范，2026-10-30（FAPI、FBP、FBSP、FEIP、FTSP、FUDP、FVEP、IM）' } }
        ]
    }
];

// "How the pieces fit" guide above the downloads. Diagram boxes and card chips
// jump to the release family (or section) named by `jump`.
export const GUIDE = {
    bands: {
        devices: { en: 'On your devices', zh: '你的设备' },
        servers: { en: 'Servers', zh: '服务器' },
        serversNote: {
            en: ['Run your own, or use public', 'ones such as freecash.info.'],
            zh: ['可自行部署，也可使用', 'freecash.info 等公共服务器。']
        }
    },
    nodes: {
        safe:     { name: 'Safe', jump: 'safe', sub: { en: 'offline keys & signing', zh: '离线密钥与签名' } },
        qr:       { name: 'EasyQR / ScanQR', jump: 'qr', sub: { en: 'carries data by QR', zh: '用二维码传递数据' } },
        freer:    { name: 'Freer', jump: 'freer', sub: { en: 'wallet · ID · chat · calls', zh: '钱包 · 身份 · 聊天 · 通话' } },
        mycoins:  { name: 'MyCoins', jump: 'mycoins', sub: { en: 'FCH, BTC, ETH…', zh: 'FCH、BTC、ETH…' } },
        explorer: { name: 'Explorer', jump: 'freeverse', sub: { en: 'web, in a browser', zh: '网页，在浏览器中' } },
        fapi:     { name: 'FapiServer', jump: 'freeverse', sub: { en: 'API for Freer', zh: '为 Freer 提供 API' } },
        apip:     { name: 'ApipServer', jump: 'freeverse', sub: { en: 'HTTP API · Tomcat', zh: 'HTTP API · Tomcat' } },
        manager:  { name: 'ApipManager', jump: 'freeverse', sub: { en: 'sets it up', zh: '配置它' } },
        es:       { name: 'Elasticsearch', sub: { en: 'indexed chain and FEIP data · install it yourself', zh: '链与 FEIP 索引数据 · 需自行安装' } },
        fch:      { name: 'FchParser', jump: 'freeverse', sub: { en: 'blocks, txs, cash', zh: '区块、交易、现金' } },
        feip:     { name: 'FeipParser', jump: 'freeverse', sub: { en: 'IDs, groups, mail…', zh: '身份、群组、邮件…' } },
        node:     { name: { en: 'Freecash full node', zh: 'Freecash 全节点' }, jump: 'dl-other', sub: { en: 'the FCH blockchain', zh: 'FCH 区块链' } }
    },
    edgeLabels: {
        blocks: { en: 'block files', zh: '区块文件' }
    },
    cards: [
        {
            title: { en: 'Everyday use', zh: '日常使用' },
            apps: ['freer'],
            text: {
                en: 'Wallet, CID identity, contacts, mail, chat, voice calls and meetings. Freer reaches the chain through a FAPI server over FUDP.',
                zh: '钱包、CID 身份、联系人、邮件、聊天、语音通话与会议。Freer 通过 FUDP 连接 FAPI 服务器访问链上数据。'
            }
        },
        {
            title: { en: 'Keep keys offline', zh: '离线保管密钥' },
            apps: ['safe', 'qr'],
            text: {
                en: 'Install Safe on a device that never goes online: it keeps keys and secrets and signs transactions, and data moves in and out only as QR codes. EasyQR and ScanQR show and scan long data as a series of codes. Freer can hold the same FID as watch-only.',
                zh: '把 Safe 装在永不联网的设备上：它保管密钥与秘密并签署交易，数据只以二维码进出。EasyQR 和 ScanQR 可将长数据显示或扫描为一组二维码。Freer 可以只读（观察）方式持有同一 FID。'
            }
        },
        {
            title: { en: 'Other coins', zh: '其他币种' },
            apps: ['mycoins'],
            text: {
                en: 'One private key for FCH, BTC, BCH, ETH and DOGE. FCH data comes from APIP servers; the other chains from public block explorers.',
                zh: '一个私钥管理 FCH、BTC、BCH、ETH 和 DOGE。FCH 数据来自 APIP 服务器，其他链的数据来自公共区块浏览器。'
            }
        },
        {
            title: { en: 'Run a server', zh: '运行服务器' },
            apps: ['dl-other', 'freeverse'],
            text: {
                en: 'Run a Freecash full node; FchParser reads its block files and FeipParser the OP_RETURN data, both indexing into Elasticsearch. FapiServer serves Freer over FUDP; ApipServer, set up with ApipManager, serves MyCoins and the Explorer over HTTP.',
                zh: '运行 Freecash 全节点；FchParser 读取它的区块文件，FeipParser 解析其中的 OP_RETURN 数据，二者都写入 Elasticsearch。FapiServer 通过 FUDP 为 Freer 提供服务；ApipServer（用 ApipManager 配置）通过 HTTP 为 MyCoins 和浏览器提供服务。'
            }
        },
        {
            title: { en: 'Build on it', zh: '开发' },
            apps: ['freeverse', 'dl-other'],
            text: {
                en: 'FC-SDK is the Java library under all the servers. FapiClient and ApipClient call the servers from a terminal, CryptoSign manages keys, signs and encrypts on the command line, and the Protocols specify every format.',
                zh: 'FC-SDK 是所有服务端所用的 Java 库。FapiClient 和 ApipClient 可在终端调用服务器，CryptoSign 在命令行中管理密钥、签名与加密，协议文档定义了所有数据格式。'
            }
        }
    ],
    // Chip names for card `apps` that are not release families
    chipNames: {
        'dl-other': { en: 'Full node & protocols', zh: '全节点与协议' }
    }
};
