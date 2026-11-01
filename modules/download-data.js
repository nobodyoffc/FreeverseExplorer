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
                    { name: 'Freer-3.4.0.apk', size: 54844820, sha256: '3c8860392ff23eccc7565ec1de0cc95c7bd79a486f11e18b26b1f1a66c4a471a' },
                    { name: 'DIDS.sig.json', size: 538, sha256: '1b21d94567a6383a2163c6a0bcee5fe6bd981d71c129d64b01261790cf09f4d9',
                      label: { en: 'Signed DID list (FJYN3D7x…): paste into Freer, Tools → Verify', zh: '签名的 DID 清单（FJYN3D7x…）：粘贴到飞人“工具 → 验签”' } }
                ]
            },
            {
                platform: 'mac',
                title: 'Freer for macOS',
                repo: 'freer-mac',
                version: '0.7',
                tag: 'v0.7',
                date: '2026-11-01',
                prerelease: true,
                requirements: { en: 'macOS 14.0 or later, Apple silicon only', zh: 'macOS 14.0 或更高版本，仅支持 Apple 芯片' },
                notice: {
                    en: 'Developer ID signed and notarized by Apple. Covers need a server running FeipParser v0.4.2.',
                    zh: '已使用 Developer ID 签名并通过 Apple 公证。封面功能需要服务器运行 FeipParser v0.4.2。'
                },
                changes: {
                    en: [
                        'Covers: texts, sounds and videos can show one of your images as a cover, or a new image published with the work under one approval; readers show it.',
                        'Release Sync publishes a release\'s texts, images, sounds and videos (FVEP11 works), images first so works can name them as covers.',
                        'Release Sync keeps repo folders per identity instead of sharing one list across vaults and FIDs.',
                        'Release Sync scans again after a run and while carves are pending, and says so when the server cannot confirm them.'
                    ],
                    zh: [
                        '封面：文本、声音和视频可以用你的一张图片作封面，或与作品一起发布一张新图片（一次批准）；阅读时显示封面。',
                        '发布同步可发布一次发布中的文本、图片、声音和视频（FVEP11 作品），先发布图片，作品可将其作为封面。',
                        '发布同步的仓库文件夹按身份分别保存，不再在各保险库和 FID 之间共用。',
                        '发布同步在运行后及有待确认的刻写时自动重新扫描；服务器无法确认时会提示。'
                    ]
                },
                assets: [
                    { name: 'Freer-0.7.dmg', size: 18742342, sha256: '8e106bdb5010268909e979b546034e3318ff2ccbec52a3dcff035a1db1888a26' },
                    { name: 'DIDS.sig.json', size: 550, sha256: '3050d9a886c762f7f94c40421b129905e42702e5de8b27418f8c4c462dd35283',
                      label: { en: 'Signed DID list (FJYN3D7x…): paste into Freer, Tools → Verify', zh: '签名的 DID 清单（FJYN3D7x…）：粘贴到飞人“工具 → 验签”' } }
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
                    { name: 'Safe-2.5.apk', size: 48893301, sha256: '5c467e1b7ee842861935e3255ab58a3d997cb1da9f4f761be5b01027e8d78833' },
                    { name: 'DIDS.sig.json', size: 526, sha256: '1784d1cc93989884d096ac167870fb03c16b5f4f20ff72d28b08ca276132a5be',
                      label: { en: 'Signed DID list (FJYN3D7x…): paste into Freer, Tools → Verify', zh: '签名的 DID 清单（FJYN3D7x…）：粘贴到飞人“工具 → 验签”' } }
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
                    { name: 'Safe-1.1.1.dmg', size: 183796325, sha256: 'a6b533ddd6f0cec53aebafd66233a83d281868a24005ab2f82539a4bf37fa298' },
                    { name: 'DIDS.sig.json', size: 556, sha256: '1f5770b6c18504581c9d6084c0f401b6f7063379e0571353ff102f25e52d2567',
                      label: { en: 'Signed DID list (FJYN3D7x…): paste into Freer, Tools → Verify', zh: '签名的 DID 清单（FJYN3D7x…）：粘贴到飞人“工具 → 验签”' } }
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
                version: '0.4.2',
                tag: 'v0.4.2',
                date: '2026-11-01',
                prerelease: true,
                requirements: {
                    en: 'Java 17+; ApipServer.war needs Tomcat 10+ (Jakarta Servlet); parsers and servers need Elasticsearch 8.8.0+. Run jars in an interactive terminal: they read the password from the console.',
                    zh: 'Java 17+；ApipServer.war 需要 Tomcat 10+（Jakarta Servlet）；解析器和服务端需要 Elasticsearch 8.8.0+。请在交互式终端中运行 jar，程序会从控制台读取密码。'
                },
                notice: {
                    en: 'Upgrading FeipParser needs a full reparse (Start New Parse from file) to index the new cover field. Upgrade FapiServer and ApipServer at the same time: a v0.4.1 server cannot read texts, sounds and videos that carry a cover. From v0.3.1 or older, also rename config/FEIP_v2.1_settings.json to FEIP_settings.json.',
                    zh: '升级 FeipParser 需要全量重新解析（Start New Parse from file），以索引新的 cover 字段。请同时升级 FapiServer 和 ApipServer：v0.4.1 的服务端读不了带封面的文本、声音和视频。从 v0.3.1 或更早版本升级时，还需将 config/FEIP_v2.1_settings.json 改名为 FEIP_settings.json。'
                },
                changes: {
                    en: [
                        'FEIP21 Text, FEIP23 Sound and FEIP25 Video gain an optional cover: the imageId of a FEIP24 Image, so updating the Image changes the cover.',
                        'FVEP11 Release: a section on works, so a release can register the texts, images, sounds and videos it publishes, with their covers.',
                        'Servers skip index fields their classes do not know instead of failing the read, so a newer parser no longer breaks an older server\'s lookups.'
                    ],
                    zh: [
                        'FEIP21 文本、FEIP23 声音和 FEIP25 视频新增可选的 cover：一个 FEIP24 图片的 imageId，更新该图片即更换封面。',
                        'FVEP11 发布：新增作品一节，发布时可登记其中的文本、图片、声音和视频及其封面。',
                        '服务端遇到不认识的索引字段时跳过，不再整条读取失败，较新的解析器不再导致旧服务端查询出错。'
                    ]
                },
                assets: [
                    { name: 'FchParser.jar', size: 57817720, sha256: '7f18ac36d29813e983c8796a4e20408ae9e993f1d2c6009ec8e0a3d04972adcf',
                      label: { en: 'Freecash chain parser: blocks, transactions, cash and inscriptions', zh: 'Freecash 链解析器：区块、交易、现金与刻字' } },
                    { name: 'FeipParser.jar', size: 57897448, sha256: '0ea009952adb6fd47e02be3205c4a10bd1a1cc482bbd8c2d1a64a72955e0a447',
                      label: { en: 'FEIP parser: identity, organization and social data', zh: 'FEIP 解析器：身份、组织与社交数据' } },
                    { name: 'FapiServer.jar', size: 63170126, sha256: '9658bfdc1a4fae291e2c3c46fd0bb62485827de9094694f58f5bb1a9b36f5b03',
                      label: { en: 'FAPI server: API provider for Freer over FUDP', zh: 'FAPI 服务端：基于 FUDP 为 Freer 提供 API' } },
                    { name: 'FapiClient.jar', size: 63170126, sha256: '0543b1ee76a9ffe2732e066ec9ce07b45f1fc961bcf2efbc5ee59d66bdf246f5',
                      label: { en: 'FAPI client', zh: 'FAPI 客户端' } },
                    { name: 'ApipServer.war', size: 62195572, sha256: '34a26100800ed0cb0fdbfc2e157835369b7a25eb55fc3556f9b0a123428bd50e',
                      label: { en: 'APIP server (web app) for the Freeverse explorer over HTTP', zh: 'APIP 服务端（Web 应用），通过 HTTP 为 Freeverse 浏览器提供 API' } },
                    { name: 'ApipManager.jar', size: 57774122, sha256: 'f50d3a768e5df0f434b1059fe9f6759a87700f4cd48e1dee2ed6e61d32c9e379',
                      label: { en: 'APIP manager: configure ApipServer before launching it', zh: 'APIP 管理器：启动 ApipServer 前配置参数' } },
                    { name: 'ApipClient.jar', size: 57751373, sha256: '7ab394e60139e2fa907806cdb8e9e38d37cc6c12ee6bc381432d5a3724efe45d',
                      label: { en: 'APIP client', zh: 'APIP 客户端' } },
                    { name: 'CryptoSign.jar', size: 63170124, sha256: 'f5a22d5d6346fac100d1417698dd8a62437847f92c6d85795744bad5093fc10f',
                      label: { en: 'CryptoSign tool', zh: 'CryptoSign 工具' } },
                    { name: 'FC-SDK.jar', size: 63170097, sha256: 'ed1345cc2fa23d0db09171fea4ccbe11d6bcfa38f23be47223f7bf8b60939fb6',
                      label: { en: 'FC-JDK library with all dependencies', zh: '含全部依赖的 FC-JDK 库' } },
                    { name: 'SHA256SUMS', size: 725, sha256: '1eb0d0f317102b94f0635d7af72fcd82e2555515fa3f1f9f276199d50d0aabeb',
                      label: { en: 'Checksums: shasum -a 256 -c SHA256SUMS', zh: '校验文件：shasum -a 256 -c SHA256SUMS' } },
                    { name: 'DIDS.sig.json', size: 1896, sha256: 'ff6cd326288c21fb964ebafcfe0c213c05594b87edc2bdc6c158bb9ea86d0a35',
                      label: { en: 'Signed DID list (FJYN3D7x…): paste into Freer, Tools → Verify', zh: '签名的 DID 清单（FJYN3D7x…）：粘贴到飞人“工具 → 验签”' } }
                ]
            },
            {
                platform: 'server',
                title: 'Freeverse Explorer',
                repo: 'FreeverseExplorer',
                version: '1.1',
                tag: 'v1.1',
                date: '2026-11-01',
                prerelease: false,
                requirements: {
                    en: 'Tomcat 9+. Unzip into Tomcat\'s webapps directory: it unpacks as ROOT and must be served at /. Restart Tomcat afterwards.',
                    zh: 'Tomcat 9+。解压到 Tomcat 的 webapps 目录：解压后为 ROOT，必须部署在根路径 /。解压后重启 Tomcat。'
                },
                notice: {
                    en: 'The explorer reads chain data from freecash.info and cid.cash. To use your own ApipServer instead, replace these two servers in ROOT/modules/api.js (SERVER_URL_HEADS) with its URL, for example https://your.domain/APIP. Download buttons link files in webapps/download; fill it with tools/mirror.sh from the source zip, or use the GitHub links.',
                    zh: '浏览器从 freecash.info 和 cid.cash 读取链上数据。如需使用你自己的 ApipServer，请在 ROOT/modules/api.js（SERVER_URL_HEADS）中把这两个服务器替换为它的地址，例如 https://your.domain/APIP。下载按钮指向 webapps/download 中的文件，可用源码包里的 tools/mirror.sh 填充，或使用 GitHub 链接。'
                },
                changes: {
                    en: [
                        'School (学堂): a page that plays the Freer School videos, with each episode\'s download and DID.',
                        'Downloads are served from this site, mirrored from GitHub and checked by SHA-256, with GitHub as a fallback.',
                        'Published works show where they can be downloaded (locas), and texts, sounds and videos show their cover.',
                        'Labels for Format and Deleted; the app list shows each app\'s OS.'
                    ],
                    zh: [
                        '学堂：播放飞人学堂视频的页面，附每集的下载和 DID。',
                        '下载文件由本站提供（从 GitHub 镜像并按 SHA-256 校验），GitHub 为备用。',
                        '已发布作品显示下载位置（locas），文本、声音和视频显示封面。',
                        '新增“格式”和“已删除”标签；应用列表显示各应用的系统。'
                    ]
                },
                assets: [
                    { name: 'FreeverseExplorer.zip', size: 520642, sha256: 'a03f474a1b2b9e7502a970ce06326e4cc2d6dcb15e7d78d3a096ece73a544c3f',
                      label: { en: 'The explorer web app: unzip into Tomcat webapps', zh: '浏览器网页应用：解压到 Tomcat 的 webapps 目录' } },
                    { name: 'SHA256SUMS', size: 88, sha256: '696fc0679fbef0b2137dc17c7ba515837c8113f15e047dd2da67d900cad9f0ee',
                      label: { en: 'Checksums: shasum -a 256 -c SHA256SUMS', zh: '校验文件：shasum -a 256 -c SHA256SUMS' } },
                    { name: 'DIDS.sig.json', size: 654, sha256: '9b9ecca8d04302aea3fd5acf9eceafca455d6911f12daad0b08c295a9df79a3a',
                      label: { en: 'Signed DID list (FJYN3D7x…): paste into Freer, Tools → Verify', zh: '签名的 DID 清单（FJYN3D7x…）：粘贴到飞人“工具 → 验签”' } }
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
            { name: 'Protocols.zip', size: 584580, sha256: '9624cde7230999a89facf8a2a854488f2db5b4d0275d426189710cce97fb65e2',
              href: 'https://github.com/nobodyoffc/Freeverse/releases/download/protocols-2026-11-01/Protocols.zip',
              label: { en: 'Protocol specifications, 2026-11-01 (FAPI, FBP, FBSP, FEIP, FTSP, FUDP, FVEP, IM)', zh: '协议规范，2026-11-01（FAPI、FBP、FBSP、FEIP、FTSP、FUDP、FVEP、IM）' } },
            { name: 'DIDS.sig.json', size: 567, sha256: '7b3e4ab404cfcfe075d3dea7c856caea6b4f8e6c2a1f4f0e61d31ad7636c97c5',
              href: 'https://github.com/nobodyoffc/Freeverse/releases/download/protocols-2026-11-01/DIDS.sig.json',
              label: { en: 'Signed DID list (FJYN3D7x…): paste into Freer, Tools → Verify', zh: '签名的 DID 清单（FJYN3D7x…）：粘贴到飞人“工具 → 验签”' } }
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
