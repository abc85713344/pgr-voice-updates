for (const button of document.querySelectorAll('[data-code]')) {
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.dataset.code); button.textContent = '已复制'; }
    catch { button.textContent = '提取码：' + button.dataset.code; }
  });
}
(async () => {
  const status = document.getElementById('status');
  const summary = document.getElementById('summary');
  try {
    const response = await fetch('latest.json', {cache:'no-store', signal:AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error('读取失败');
    const data = await response.json();
    if (data.schemaVersion !== 1) throw new Error('公告格式错误');
    if (data.enabled !== true) {
      status.textContent = '目前暂无已发布的更新公告';
      summary.textContent = '公告服务已准备好。新版安装包上传网盘后，这里会显示版本号和更新内容。';
      return;
    }
    status.textContent = '最新版本公告';
    summary.textContent = '查看下面的更新内容，并选择网盘下载。';
    for (const [key,label] of [['windows','电脑版'],['android','安卓版']]) {
      const release = data[key];
      const article = document.createElement('article');
      const title = document.createElement('h2'); title.textContent = label + ' · ' + release.version;
      const date = document.createElement('p'); date.textContent = '发布于 ' + release.publishedAt;
      const list = document.createElement('ul');
      for (const note of release.notes) { const item=document.createElement('li'); item.textContent=note; list.append(item); }
      article.append(title,date,list); document.getElementById('releases').append(article);
    }
  } catch {
    status.textContent = '暂时无法读取更新公告';
    summary.textContent = '请稍后刷新。你仍可使用下面的网盘下载入口。';
  }
})();
