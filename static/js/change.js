document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('calculationForm');
  form.addEventListener('change', () => {
    form.style.cssText = "border: 2px solid green";
  })
});
