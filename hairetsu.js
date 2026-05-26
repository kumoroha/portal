/* ==========================================================================
   extensions-data.js - 拡張子図鑑専用 データベース
   ========================================================================== */

const extensionsDb = [
    { ext: ".html / .css", desc: "Webページの骨組みと装飾", group: "Web & Document" },
    { ext: ".js", desc: "ブラウザやサーバーで動くスクリプト", group: "Web & Document" },
    { ext: ".json", desc: "軽量なデータ交換形式（設定ファイル等）", group: "Web & Document" },
    { ext: ".md", desc: "文章を簡単に見栄え良く書けるMarkdown", group: "Web & Document" },
    
    { ext: ".py", desc: "Pythonのソースコードファイル", group: "Programming & System" },
    { ext: ".cs", desc: "C#のソースコードファイル", group: "Programming & System" },
    { ext: ".sh / .bat", desc: "LinuxやWindowsの自動処理スクリプト", group: "Programming & System" },
    { ext: ".vbs", desc: "簡単かつ強力なWindows用スクリプト", group: "Programming & System" },
    
    { ext: ".csv", desc: "カンマで区切られた単純な表データ", group: "Data & Media" },
    { ext: ".svg", desc: "拡大しても絶対に画質が荒れないベクター画像", group: "Data & Media" },
    { ext: ".mp4 / .mkv", desc: "高画質な動画を格納するコンテナ形式", group: "Data & Media" },
    { ext: ".zip / .tar.gz", desc: "複数のファイルを1つにまとめる圧縮形式", group: "Data & Media" }
];
