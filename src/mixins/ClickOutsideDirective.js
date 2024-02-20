// ClickOutsideDirective.js
const clickOutsideDirective = {
  mounted(el, binding) {
    // Define the function to check if the clicked element is outside the bound element
    const handleClickOutside = (event) => {
      if (!el.contains(event.target) && el !== event.target) {
        binding.value(event); // Call the provided method
      }
    };

    // Add event listener on the document
    document.addEventListener('click', handleClickOutside);

    // When the element is unmounted, remove the event listener
    el._clickOutsideDirectiveCleanup = () => {
      document.removeEventListener('click', handleClickOutside);
    };
  },
  beforeUnmount(el) {
    // Cleanup the event listener when the element is unmounted
    el._clickOutsideDirectiveCleanup && el._clickOutsideDirectiveCleanup();
  },
};

export default clickOutsideDirective;