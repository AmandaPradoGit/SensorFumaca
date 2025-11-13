const header = document.createElement('header');
header.className = 'fixed top-0 left-0 w-full z-50 bg-[#f3f3f3]'; 
header.innerHTML = `
    <div class="bg-[#f3f3f3] text-white p-8">
        <nav class="max-w-7xl mx-auto flex justify-between items-center">
            <a href="#" class="flex items-center">
                <img src="imgs/icon.png" alt="icon" class="h-8">
            </a>
            <div class="flex items-center space-x-6 md:space-x-8">
          <a href="/dashboards" class="text-black hover:text-gray-700 text-sm md:text-base">Dashboard</a>
          <a href="/sensores" class="text-black hover:text-gray-700 text-sm md:text-base">Sensores</a>
          <img src="imgs/exit.png" alt="Logout" class="w-6 h-6 md:w-8 md:h-8 " />
        </div>
        </nav>
      </div>
    </div>`;

  document.addEventListener('DOMContentLoaded', () => {
  document.body.prepend(header);

  const exitPic = header.querySelector('img[alt="Logout"]');
  if (exitPic) {
    exitPic.style.cursor = 'pointer'; 
    exitPic.addEventListener('click', () => {
        const form = Object.assign(document.createElement('form'), {
            action: '/logout',
            method: 'POST',
            style: 'display:none'
        });
        document.body.appendChild(form).submit();
    });
  }

 const icon = header.querySelector('img[alt="icon"]');
  if (icon) {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', () => {
      window.location.href = '/sensores';
    });
  }
});