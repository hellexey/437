const search = document.getElementById('search')
const searchResults = document.getElementById('searchResults')
const repos = document.getElementById('repos')

function debounce (func, timeout = 500) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

search.addEventListener('input', debounce(event => {
  const query = event.target.value.trim()
  if (query !== '') {
    fetch(`https://api.github.com/search/repositories?q=${query}`)
      .then(response => response.json())
      .then(data => {
        searchResults.innerHTML = ''
        for (let i = 0; i < 5 && i < data.items.length; i++) {
          const repository = data.items[i]
          const li = document.createElement('li')
          li.textContent = repository.full_name
          li.addEventListener('click', () => {
            addRepository(repository)
            search.value = ''
            searchResults.innerHTML = ''
          })
          searchResults.appendChild(li)
        }
      })
      .catch(error => console.error(error))
  } else {
    searchResults.innerHTML = ''
  }
}))

function addRepository (repository) {
  const li = document.createElement('li')
  const spanWrapper = document.createElement('div')
  spanWrapper.style.display = 'inline-block'
  const nameSpan = document.createElement('span')
  nameSpan.textContent = `Name: ${repository.name}`
  nameSpan.style.display = 'block'
  const ownerSpan = document.createElement('span')
  ownerSpan.textContent = `Owner: (${repository.owner.login})`
  ownerSpan.style.display = 'block'
  const starsSpan = document.createElement('span')
  starsSpan.textContent = `Stars: ${repository.stargazers_count}`
  const deleteButton = document.createElement('button')
  deleteButton.innerHTML = '&#10060;'
  deleteButton.addEventListener('click', () => {
    li.remove()
  })
  li.appendChild(spanWrapper)
  spanWrapper.appendChild(nameSpan)
  spanWrapper.appendChild(ownerSpan)
  spanWrapper.appendChild(starsSpan)
  li.appendChild(deleteButton)
  repos.appendChild(li)
  li.style.border = '2px solid black'
  li.style.marginBottom = '10px'
  li.style.display = 'flex'
  li.style.justifyContent = 'space-between'
  spanWrapper.style.textAlign = 'left'
  deleteButton.style.marginLeft = 'auto'
  deleteButton.style.textAlign = 'center'
}
