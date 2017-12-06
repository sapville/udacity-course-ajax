(function () {
  const form = document.querySelector('#search-form');
  const searchField = document.querySelector('#search-keyword');
  let searchedForText;
  const responseContainer = document.querySelector('#response-container');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;

    function addImage (data) {
      let containerContent = '';
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
    }

    function requestError (e, part) {
      console.log(e);
      responseContainer.insertAdjacentHTML('beforeend',
        `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }

    const ImgLoad = fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
      {
        headers: {
          Authorization: 'Client-ID 14d5810d436b6e09a64261d8b3d8271645affec5c67a0633fb52a7002b071fcb'
        }
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error('network error');
        }
      })
      .then(
        data => new Promise((resolve) => {
          addImage(data.results[0]);
          resolve();
        })
      )
      .catch(
        e => new Promise((resolve) => {
          requestError(e, 'image');
          resolve();
        })
      );

    ImgLoad.then(() => {
      fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=faaff1099919450984229eae4d765e1a`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error('network error');
          }
        })
        .then(addArticles)
        .catch(e => requestError(e, 'article'));
    });

    function addArticles (data) {
      let containerContent = '';
      if (!data || !data.response.docs || data.response.docs.length < 1) {
        containerContent = '<div class="error-no-articles">No articles found</div>';
      } else {
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
  });
})();
