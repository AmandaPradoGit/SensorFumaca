const header = document.createElement('header');
header.className = ' font-mono fixed top-0 left-0 w-full z-50 bg-white'; 
header.innerHTML = `
    <div class="bg-orange-200 text-white p-8 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        
        <div class="flex items-center">
          <img src="imgs/icon.png" alt="icon" class="w-24 h-10 md:w-24 " />
        </div>
        
        <div class="flex items-center space-x-6 md:space-x-8">
          <a href="../frontend/dashboard.html" class="text-black hover:text-gray-700 text-sm md:text-base">Dashboard</a>
          <img src="imgs/profilepic.png" alt="Perfil" class="w-6 h-6 md:w-8 md:h-8 rounded-full" />
        </div>
        
      </div>
    </div>`;

  document.addEventListener('DOMContentLoaded', () => {
  document.body.prepend(header);

  const profilePic = header.querySelector('img[alt="Perfil"]');
  if (profilePic) {
    profilePic.style.cursor = 'pointer'; 
    profilePic.addEventListener('click', () => {
      window.location.href = 'profile.html';
    });
  }

 const icon = header.querySelector('img[alt="icon"]');
  if (icon) {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
});