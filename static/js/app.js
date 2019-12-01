const content = `
  <h1>Hello, world!</h1>
  <p>This is the index page</p>

  <form id="calculationForm">
      <input type="number" name="a" value="0"/>
      <input type="number" name="b" value="0"/>
      <input type="submit" value="Add">
  </form>
  
  <p>This website has more pages:</p>
  
  <p id="resultText"></p>
  
  <ul>
      <li><a href="/static/pages/first.html"> The first page which is useless</a> </li>
      <li><a href="/static/pages/second.html"> The second page which is also useless</a> </li>
  </ul>
`;

document.addEventListener('DOMContentLoaded', function() {
  const view = document.getElementById('view');
  view.innerHTML = content;

  // Handle form submits from JS
  const form = document.getElementById('calculationForm');
  form.addEventListener("submit",async function(e) {
    e.preventDefault(); // Prevent form submit and page reload

    // serialize form to a JS object
    const formData = Object.fromEntries(new FormData(form));

    // make a request to web server
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    // read response data
    const responseBody = await response.json();

    // update the view
    const resultText = document.getElementById('resultText').innerText =
      `sum is: ${responseBody.result}`;
  });
}, false);
