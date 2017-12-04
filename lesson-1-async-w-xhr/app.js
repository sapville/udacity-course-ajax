(function () {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  searchField.value = 'hippo';
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let searchRequest = '';
    searchedForText = searchField.value;

    const imgLoad = new Promise((resolve) => {
      const imgReq = new XMLHttpRequest();
      imgReq.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
      imgReq.setRequestHeader('Authorization', 'Client-ID 14d5810d436b6e09a64261d8b3d8271645affec5c67a0633fb52a7002b071fcb');
      imgReq.onload = addImage;
      imgReq.onerror = function () {
        responseContainer.innerHTML = '<p>Error occurred during the request</p>';
        resolve();
      };
      imgReq.send();

      function addImage () {
        let containerContent = '';
        const data = JSON.parse(this.responseText).results[0];
        responseContainer.innerHTML = '';
        if (!data) {
          containerContent = '<p class="error-no-image">No image found</p>';
        } else {
          containerContent = `
        <figure>
            <img src="${data.urls.regular}" alt="${searchedForText}">
            <figcaption>Photo by ${data.user.first_name} ${data.user.last_name}</figcaption>
        </figure>
      `;
        }
        responseContainer.insertAdjacentHTML('beforeend', containerContent);
        resolve();
      }
    });

    imgLoad.then( () => {
      const artReq = new XMLHttpRequest();
      artReq.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=faaff1099919450984229eae4d765e1a`);
      artReq.onload = addArticles;
      artReq.onerror = reqError;
      artReq.send();
    });


  });

  function reqError () {
    responseContainer.innerHTML = '<p>Error occurred during the request</p>';
  }

  function addArticles () {
    const data = JSON.parse(this.responseText);
    let containerContent = '';
    if (!data || !data.response.docs || data.response.docs.length < 1) {
      containerContent = '<div class="error-no-articles">No articles found</div>';
    } else {
      // console.log(data);
      containerContent =
        '<ul>' +
          data.response.docs.map(article => `
            <li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a> </h2>
                <p>${article.snippet}</p>
            </li>`).join('')
        + '</ul>';
    }
    responseContainer.insertAdjacentHTML('beforeend', containerContent);
  }

})();
