

module.exports = {
    cwd:process.cwd(),
    server_host:"http://47.106.35.151",
    mysql_host: 'localhost',
    mysql_port:3306,
    mysql_username:"root",
    mysql_password:"156321",
    database: 'RSB',
    default_file_password:"156321",
    // login_path:"/login.html",
    // main_path:"/main.html",
    
    // tool_translate:"/translate.html",
    // tool_crypto:"/crypto.html",
    // tool_piclinks:"/piclinks.html",
    // tool_knowledge:"/knowledge.html",
    // file_download:"/download.html",
    login_path:"/page/login",
    main_path:"/page/main",
    tool_translate:"/page/tool/translate",
    tool_crypto:"/page/tool/crypto",
    tool_piclinks:"/page/tool/piclinks",
    tool_knowledge:"/page/tool/knowledge",
    file_download:"/page/download",

    papers_per_page:8,
    MeetingPicsUrl:"/api/gitee/MeetingPics.json",
    piclinks:"/api/gitee/piclinks.json",
    links:"/api/gitee/links.json",
    exprimentsUrl:"http://47.106.35.151:9090"
  }