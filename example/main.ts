const inputElement = document.querySelector('#input')

if (inputElement) {
  inputElement.addEventListener('input', (e) => {
    const valueElement = document.querySelector('#value')
    valueElement && (valueElement.innerHTML = (e.target as HTMLInputElement).value)
  })
}
