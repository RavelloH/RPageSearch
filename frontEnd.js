const dataFilePath = "/assets/data/search.json"; // search.json路径
const workerPath = "../assets/js/worker/search.worker.js"; // search.worker.js路径

function search(keyword) {
  let start = new Date().getTime();
  if (keyword == "" || keyword == ".") {
    return false;
  }
  searchWord = HTMLDecode(keyword);
  getSearchData().then((data) => {
    if (typeof searchWorker == "undefined") {
      searchWorker = new Worker(workerPath);
    }
    searchWorker.onmessage = (result) => {
      let end = new Date().getTime();
      let data = result.data;
      console.log(`查询操作用时${end - start}MS`);
      if (data.length == 0) {
        console.log("未找到有关选项");
        return false;
      }
      let resultHTML = "";
      data.forEach((e, index) => {
        resultHTML += structureSearchResult(e);
      });
      console.log(resultHTML); // 结果输出
    };
    searchWorker.postMessage([data, searchWord]);
  });
}

function getSearchData() {
  if (typeof searchData == "undefined") {
    return new Promise((resolve, reject) => {
      fetch(dataFilePath, {})
        .then((response) => response.json())
        .then((data) => {
          searchData = data;
          resolve(data);
        });
    }).catch((err) => {
      throw err;
    });
  } else {
    return Promise.resolve(searchData);
  }
}

function HTMLEncode(str) {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/ /g, "&nbsp;");
  s = s.replace(/\'/g, "&#39;");
  s = s.replace(/\"/g, "&quot;");
  s = s.replace(/\n/g, "<br/>");
  return s;
}

function HTMLDecode(str) {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#39;/g, "'");
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/<br\/>/g, "\n");
  return s;
}

function structureSearchResult(result) {
  let cla = "";
  let tag = "";
  let match = "";
  let matchItem,
    matchNum,
    matchContext,
    matchTag,
    matchClass,
    matchTitle,
    matchLinks;
  let strLinks = "";

  result.match.forEach((e) => {
    if (typeof e == "object") {
      matchItem = e[0];
    } else {
      matchItem = e;
    }
    switch (matchItem) {
      case "name":
        match += "标题 / ";
        break;
      case "context":
        matchNum = e;
        match += `内容(${e[1]}次) / `;
        break;
      case "title":
        match += "章节 / ";
        matchTitle = e;
        break;
      case "tag":
        match += "标签 / ";
        matchTag = e;
        break;
      case "class":
        match += "分类 / ";
        matchClass = e;
        break;
      case "links":
        match += "外链 / ";
        matchLinks = e;
        break;
    }
  });
  result.class.forEach((e, index) => {
    if (typeof matchClass !== "undefined" && matchClass[1] == index) {
      cla += `<a href="#/classification/${e}" class='active'>${e}</a>/`;
    } else {
      cla += `<a href="#/classification/${e}">${e}</a>/`;
    }
  });
  cla = cla.substring(0, cla.length - 1);
  result.tag.forEach((e, index) => {
    if (typeof matchTag !== "undefined" && matchTag[1] == index) {
      tag += `<a href="#/tag/${e}" class='active'>${e}</a>`;
    } else {
      tag += `<a href="#/tag/${e}">${e}</a>`;
    }
  });
  match = match.substring(0, match.length - 3);
  if (typeof matchNum == "undefined" || matchNum[2] < 10) {
    matchContext = result.context.substring(0, 150);
  } else {
    matchContext = result.context.substring(
      matchNum[2] - 10,
      matchNum[2] + 140,
    );
  }
  result.links.forEach((e, index) => {
    if (typeof matchLinks !== "undefined" && matchLinks[1] == index) {
      strLinks = `<a class='search-result-links one-line' href='${e}'><span class='i_small ri:link'></span> ${e}</a>`;
    }
  });
  return `
    <div class="loaded listprogram">
        <article>
            <span class="article-name">
            <h4><a href="${result.url}">${result.name}</a></h4>
            </span>
            <p class="articles-info">
                <span class='search-result-tags'>${match}</span>
                <time>${result.time}</time> • <span class="i_small ri:archive-line"></span>
                <span class="class">
                    ${cla}
                </span>
                <div class='search-result-context'><span class='i_small ri:file-list-2-line'></span> ...${matchContext}</div>
                ${strLinks}
            </p>
            <p class="articles-tags">
                ${tag}
            </p>
        </article>
        <hr>
    </div>
    `;
}
