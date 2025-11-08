const header = document.createElement('header');
header.className = 'fixed top-0 left-0 w-full z-50 bg-[#f3f3f3]'; 
header.innerHTML = `
    <div class="bg-[#f3f3f3] text-white p-8">
        <nav class="max-w-7xl mx-auto flex justify-between items-center">
            <a href="#" class="flex items-center">
                <img src="imgs/icon.png" alt="icon" class="h-8">
            </a>
            <div class="flex items-center space-x-6 md:space-x-8">
          <a href="../frontend/dashboard.html" class="text-black hover:text-gray-700 text-sm md:text-base">Dashboard</a>
          <a href="../frontend/dashboard.html" class="text-black hover:text-gray-700 text-sm md:text-base">Sensores</a>
          <img src="imgs/profilepic.png" alt="Perfil" class="w-6 h-6 md:w-8 md:h-8 rounded-full" />
        </div>
        </nav>
      </div>
    </div>`;

  document.addEventListener('DOMContentLoaded', () => {
  document.body.prepend(header);

  const profilePic = header.querySelector('img[alt="Perfil"]');
  if (profilePic) {
    profilePic.style.cursor = 'pointer'; 
    profilePic.addEventListener('click', () => {
      window.location.href = 'perfil.html';
    });
  }

 const icon = header.querySelector('img[alt="icon"]');
  if (icon) {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', () => {
      window.location.href = 'principal.html';
    });
  }
});