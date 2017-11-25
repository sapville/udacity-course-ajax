(function () {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  searchField.value = 'hippo';
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');
  const c_mode = {
    nyt: 'nyt',
    unsplash: 'unsplash'
  };
  let mode = c_mode.nyt;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let searchRequest = '';
    searchedForText = searchField.value;
    mode = document.getElementById('nyt').checked ? c_mode.nyt : c_mode.unsplash;
    const req = new XMLHttpRequest();
    switch (mode) {
      case c_mode.nyt:
        searchRequest = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=faaff1099919450984229eae4d765e1a`;
        req.onload = addArticles;
        break;
      case c_mode.unsplash:
        searchRequest = `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`;
        req.onload = addImages;
        break;
    }
    req.open('GET', searchRequest);
    if (mode === c_mode.unsplash) {
      req.setRequestHeader('Authorization', 'Client-ID 14d5810d436b6e09a64261d8b3d8271645affec5c67a0633fb52a7002b071fcb');
    }
    req.onerror = () => {
      responseContainer.innerHTML = `
      <p>Error occurred during the request</p>
    `;
    };
    req.send();
  });

  function addArticles () {
    responseContainer.innerHTML = '';
    JSON.parse(this.responseText).response.docs.forEach(addArticle);
  }

  function addArticle (data) {
    let containerContent = '';
    if (!data) {
      containerContent = '<p>No article found</p>'
    } else {
      console.log(data);
      containerContent = `
      
      `;
    }
  }

  function addImages () {
    responseContainer.innerHTML = '';
    JSON.parse(this.responseText).results.forEach(addImage);
  }

  function addImage (data) {
    let containerContent = '';
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
  }

})();
