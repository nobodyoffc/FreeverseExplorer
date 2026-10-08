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
                version: '3.3.0',
                tag: 'v3.3.0',
                date: '2026-10-06',
                prerelease: false,
                requirements: { en: 'Android 9.0 (API 28) or newer', zh: 'Android 9.0（API 28）或更高版本' },
                notice: {
                    en: 'From 3.2.2: installs in place, keys and data stay. From 3.1.1 or earlier: you must uninstall first, which erases the keys and data on the device. Export your private keys, CIDs and secrets before uninstalling.',
                    zh: '从 3.2.2 升级：直接覆盖安装，密钥和数据保留。从 3.1.1 或更早版本升级：必须先卸载，卸载会清除设备上的密钥和数据。卸载前请先导出私钥、CID 和秘密并在设备外核对。'
                },
                changes: {
                    en: [
                        'Voice calls: end-to-end sealed audio (Opus) with attested senders; direct or via the callee\'s CALL relay; FUDP falls back to TCP when UDP gets no answer; optional echo canceller (AEC3).',
                        'Meetings: group and Team meetings on the group\'s CALL service, or with people you pick; re-keyed when someone joins or leaves.',
                        'Argon2id runs in native code: the password check takes a fraction of a second.',
                        'Imported key lists are sealed for this device; watch-only keys can no longer become a main FID.',
                        'Home BASE: follow it, and choose whether BASE and DISK are private or public.',
                        'Service search no longer requires the FAPI type.',
                        'FUDP: packets stay under one MTU; the peer book saves atomically; stream and ACK fixes.',
                        'FAPI client: a top-up is no longer reported as balance drift.',
                        'Getting started remembers a finished checklist.'
                    ],
                    zh: [
                        '语音通话：端到端加密音频（Opus），发送者经过认证；可直连或经被叫方的 CALL 中继；UDP 无响应时 FUDP 回退到 TCP；可选回声消除（AEC3）。',
                        '会议：在群的 CALL 服务上召开群组和团队会议，也可自选参会人；有人加入或离开时自动更换密钥。',
                        'Argon2id 改用原生代码运行，密码校验仅需不到一秒。',
                        '导入的密钥列表为本设备加密保存；只读（观察）密钥不能再成为主 FID。',
                        'Home BASE：可关注，并可设置 BASE 和 DISK 为私有或公开。',
                        '服务搜索不再要求 FAPI 类型。',
                        'FUDP：数据包保持在一个 MTU 内；节点簿原子保存；修复了若干流与 ACK 问题。',
                        'FAPI 客户端：充值不再被误报为余额偏差。',
                        '入门指引会记住已完成的清单。'
                    ]
                },
                signedWith: 'android',
                assets: [
                    { name: 'Freer-3.3.0.apk', size: 54750330, sha256: 'b93ed1a3d7970e2fc03a60cf73625f225c6a2785609a8508d63241ba915b9110' }
                ]
            },
            {
                platform: 'mac',
                title: 'Freer for macOS',
                repo: 'freer-mac',
                version: '0.4.1',
                tag: 'v0.4.1',
                date: '2026-10-06',
                prerelease: true,
                requirements: { en: 'macOS 14.0 or later, Apple silicon only', zh: 'macOS 14.0 或更高版本，仅支持 Apple 芯片' },
                notice: {
                    en: 'Developer ID signed and notarized by Apple: opens on a double-click with no Gatekeeper warning.',
                    zh: '已使用 Developer ID 签名并通过 Apple 公证，双击即可打开，不会被系统拦截。'
                },
                changes: {
                    en: [
                        'Voice calls and meetings: 1:1 calls via relay or a direct path, FUDP over TCP fallback; meetings with chosen people; Freer stays in the menu bar to stay available for calls.',
                        'Service components: home BASE picks the server; BASE and DISK can be private or public; CALL, MAP and BASE set from buttons.',
                        'DOCK: a server answering 402 offers a balance top-up; DOCKs polled every 10 s in front, every minute behind.',
                        'Teams: bulk appoint and remove managers, search long member lists.',
                        'SSH terminal: focus on connect; scroll back from the keyboard.',
                        'Keys exported from Android import as main FIDs; one-click copy of warnings and errors.'
                    ],
                    zh: [
                        '语音通话与会议：一对一通话经中继或直连，可回退到基于 TCP 的 FUDP；可与自选的人开会；Freer 常驻菜单栏以便接听来电。',
                        '服务组件：由 home BASE 选择服务器；BASE 和 DISK 可设为私有或公开；可通过按钮设置 CALL、MAP 和 BASE。',
                        'DOCK：服务器返回 402 时提供余额充值；前台每 10 秒、后台每分钟轮询。',
                        '团队：批量任免管理员，可搜索长成员列表。',
                        'SSH 终端：连接后自动聚焦；可用键盘回滚。',
                        '从 Android 导出的密钥可作为主 FID 导入；警告与错误一键复制。'
                    ]
                },
                assets: [
                    { name: 'Freer-0.4.1.dmg', size: 17887189, sha256: '0d67a283b6b77f74ff37e07be4fd278066c35f98eb758bd195a99d4a182bb925' }
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
                version: '2.4',
                tag: 'v2.4',
                date: '2026-10-06',
                prerelease: false,
                requirements: { en: 'Android 9 (API 28) or later', zh: 'Android 9（API 28）或更高版本' },
                notice: {
                    en: 'On first unlock, 2.4 moves your vault to a new format. Don\'t go back to an older version afterwards: it won\'t open your vault. Password exports from 2.4 can\'t be read by older Safe, Freer and Freer for Mac.',
                    zh: '首次解锁时 2.4 会把保险库迁移到新格式。升级后请勿回退到旧版本，旧版无法打开新保险库。2.4 用密码导出的数据，旧版 Safe、Freer 和 Freer for Mac 无法读取。'
                },
                changes: {
                    en: [
                        'The vault stays on the device: excluded from cloud backup and device-to-device transfer (Android 12+).',
                        'Argon2id password check in native code, with a waiting dialog while it runs.',
                        'The app locks once each time you return from the background.',
                        'Signed with the developer FID key (APK Signature Scheme v3), the same signer as Freer.'
                    ],
                    zh: [
                        '保险库只留在本机：不参与云备份和设备间迁移（Android 12+）。',
                        '密码校验改用原生 Argon2id，运行时显示等待提示。',
                        '每次从后台返回时锁定一次。',
                        '使用开发者 FID 派生的密钥签名（APK 签名方案 v3），与 Freer 同一签名者。'
                    ]
                },
                signedWith: 'android',
                assets: [
                    { name: 'Safe-2.4.apk', size: 48881689, sha256: '4ff303fa1a687b2e27836fe06d7f7376f114d22945ecdf6683e5765bd2f71f2c' }
                ]
            },
            {
                platform: 'mac',
                title: 'Safe for macOS',
                repo: 'SafeForMac',
                version: '1.1.0',
                tag: 'v1.1.0',
                date: '2026-10-07',
                prerelease: false,
                requirements: { en: 'macOS 11 or later, Apple silicon (M1 or later)', zh: 'macOS 11 或更高版本，Apple 芯片（M1 及以上）' },
                notice: {
                    en: 'Notarization is still pending: approve the first launch once (macOS 15+: System Settings → Privacy & Security → Open Anyway; macOS 14 and earlier: Control-click → Open). The first unlock after upgrading migrates the wallet (up to a minute); don\'t go back to 1.0.x afterwards.',
                    zh: '尚未完成 Apple 公证：首次打开需放行一次（macOS 15+：系统设置 → 隐私与安全性 → 仍要打开；macOS 14 及以下：按住 Control 点按 → 打开）。升级后首次解锁会迁移钱包（最多约一分钟），之后请勿回退到 1.0.x。'
                },
                changes: {
                    en: [
                        'The vault is opened by a random data key wrapped under your password with Argon2id; nothing derived from your password is stored on disk.',
                        'Change password (Tools → Change password) without touching your records.',
                        'Screenshots and screen recordings don\'t capture Safe\'s windows.',
                        'Reads everything Android Safe 2.4 writes: password bundles, ChaCha20 / X25519 and Bitcore ciphers, key and secret backups.',
                        'Faster signing: Argon2id no longer runs for every key.',
                        'Wallets lost from the wallet list by 1.0.x are found and restored.'
                    ],
                    zh: [
                        '保险库由随机数据密钥打开，该密钥以 Argon2id 在密码下加密；磁盘上不再保存任何由密码派生的内容。',
                        '支持修改密码（工具 → 修改密码），记录本身不受影响。',
                        '截屏和录屏不会捕获 Safe 的窗口。',
                        '可读取 Android Safe 2.4 写出的全部数据：密码包、ChaCha20 / X25519 与 Bitcore 密文、密钥和秘密备份。',
                        '签名更快：不再为每个密钥运行 Argon2id。',
                        '1.0.x 从钱包列表中丢失的钱包可被找回。'
                    ]
                },
                assets: [
                    { name: 'Safe-1.1.0.dmg', size: 183696372, sha256: 'bede92522fd5428ea66f96a660e6663a5cc19e5195b263f9eb04346a850716e6' }
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
                version: '0.3.1',
                tag: 'v0.3.1',
                date: '2026-10-08',
                prerelease: true,
                requirements: {
                    en: 'Java 17+; ApipServer.war needs Tomcat 10+ (Jakarta Servlet); parsers and servers need Elasticsearch 8.8.0+. Run jars in an interactive terminal: they read the password from the console.',
                    zh: 'Java 17+；ApipServer.war 需要 Tomcat 10+（Jakarta Servlet）；解析器和服务端需要 Elasticsearch 8.8.0+。请在交互式终端中运行 jar，程序会从控制台读取密码。'
                },
                notice: {
                    en: 'Upgrading FeipParser from v0.2 or older needs a full reparse: stop FeipParser and pause the FAPI/APIP servers, run Start New Parse from file, and restart the servers once it has caught up. It will not resume on indices built by an older version.',
                    zh: '从 v0.2 或更早版本升级 FeipParser 需要全量重新解析：停止 FeipParser 并暂停 FAPI/APIP 服务端，选择“Start New Parse from file”，追上链后再启动服务端。它不会在旧版本建立的索引上继续解析。'
                },
                changes: {
                    en: [
                        'A locked local database no longer hangs Tomcat: ApipServer fails just its webapp and logs which database is locked; command-line apps print it and exit.',
                        'FEIP Contact, Mail and Secret keep a history of every operation; a rollback now undoes an orphaned update, delete or recover instead of leaving it in the index.',
                        'Consensus: Contact delete/recover skip contacts the signer does not own; an add or update with an empty cipher is rejected (FEIP12, FEIP17, FEIP7).',
                        'FeipParser refuses to resume on indices without the new histories, and Reparse ID list handles box, contact, mail and secret.',
                        'FC-SDK: ContactOpData and SecretOpData gain makeUpdate; the CLI contact and secret managers can update on chain.'
                    ],
                    zh: [
                        '本地数据库被占用时不再使 Tomcat 卡死：ApipServer 只让自身的 Web 应用启动失败，并记录被占用的数据库；命令行程序打印该信息后退出。',
                        'FEIP 联系人、邮件和秘密保留每次操作的历史；回滚时会撤销孤块中的更新、删除或恢复操作，不再遗留在索引中。',
                        '共识：联系人的删除/恢复会跳过不属于签名者的条目；密文为空的添加或更新会被拒绝（FEIP12、FEIP17、FEIP7）。',
                        'FeipParser 拒绝在缺少新历史索引的旧索引上继续解析；“Reparse ID list”支持 box、contact、mail 和 secret。',
                        'FC-SDK：ContactOpData 和 SecretOpData 新增 makeUpdate；命令行联系人和秘密管理器可在链上更新。'
                    ]
                },
                assets: [
                    { name: 'FchParser.jar', size: 57759060, sha256: '3526a32e30b827714c8877e38afe9715a7712c4b31436b75561ed7da7287237f',
                      label: { en: 'Freecash chain parser v2.1: blocks, transactions, cash and inscriptions', zh: 'Freecash 链解析器 v2.1：区块、交易、现金与刻字' } },
                    { name: 'FeipParser.jar', size: 57842272, sha256: 'e75a963b9b796e1ba89b2747a00775b43afeba2f94c2204bd39ceb37ef22c60f',
                      label: { en: 'FEIP parser v2.1: identity, organization and social data', zh: 'FEIP 解析器 v2.1：身份、组织与社交数据' } },
                    { name: 'FapiServer.jar', size: 63125626, sha256: '0b278603e555a6b5c03649be2ef2b960d9a14d9bf0542a25f50a5a3e7122d1b5',
                      label: { en: 'FAPI server v1.3: API provider for Freer over FUDP', zh: 'FAPI 服务端 v1.3：基于 FUDP 为 Freer 提供 API' } },
                    { name: 'FapiClient.jar', size: 63125628, sha256: '490a9a0f3f4eae6c20279e2e824ffec3818fe929ea019f859030a0e10cd6e838',
                      label: { en: 'FAPI client', zh: 'FAPI 客户端' } },
                    { name: 'ApipServer.war', size: 62193213, sha256: '9d66847df912f4b7c1a6d935c6e271e978fb4f2384cb4a71ab8ed3337e8e7c0e',
                      label: { en: 'APIP server (web app) for the Freeverse explorer over HTTP', zh: 'APIP 服务端（Web 应用），通过 HTTP 为 Freeverse 浏览器提供 API' } },
                    { name: 'ApipManager.jar', size: 57756911, sha256: '75a822716092676e9d28f1bfe58d32bc87bb6392668bb214d86ec9993316b588',
                      label: { en: 'APIP manager v2.1: configure ApipServer before launching it', zh: 'APIP 管理器 v2.1：启动 ApipServer 前配置参数' } },
                    { name: 'ApipClient.jar', size: 57700737, sha256: '2e6580aee449cee61bf53cbcbffa8f64ae1073d5579789187e3e911e0dbd1942',
                      label: { en: 'APIP client', zh: 'APIP 客户端' } },
                    { name: 'CryptoSign.jar', size: 63125624, sha256: '21b76c2e5595bf787c50b83b516fb2d132ccabfff28fd41f775468afbf5686c6',
                      label: { en: 'CryptoSign tool', zh: 'CryptoSign 工具' } },
                    { name: 'FC-SDK.jar', size: 63125598, sha256: '20b8a85f1e6ba4d33d0fbd370c61c456c47e16088b6c0ac921f224d908c85aee',
                      label: { en: 'FC-JDK library with all dependencies', zh: '含全部依赖的 FC-JDK 库' } },
                    { name: 'SHA256SUMS', size: 725, sha256: 'b151b81c7efbb2d921576d33bf6d87e157d7b9727a78fe7767f3842582be02d6',
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
            { name: 'Protocols.zip', size: 589146, sha256: '5e06a4c95f76c30441e884a24b1461cfb93475b462aa9bc2a88845d9b2e2aa66',
              href: 'https://github.com/nobodyoffc/Freeverse/releases/download/protocols-2026-10-08/Protocols.zip',
              label: { en: 'Protocol specifications, 2026-10-08 (FAPI, FBP, FBSP, FEIP, FTSP, FUDP, FVEP, IM)', zh: '协议规范，2026-10-08（FAPI、FBP、FBSP、FEIP、FTSP、FUDP、FVEP、IM）' } }
        ]
    }
];
