export function showMessageModal({message, buttonTitle, href}) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black/60 z-[500] flex items-center justify-center";
    modal.innerHTML = `
        <div class="flex flex-col items-center justify-center space-y-6 background-color-alt rounded shadow max-w-md h-1/3 w-full p-3 text-center">
            <h1 class="text-2xl text-center font-bold text-primary">WaifuVerse</h1>
            <p class="text-base mb-4">${message}</p>
            <button class="ok-btn text-sm sm:text-base mt-2 px-4 py-1.5 rounded button-primary">
            ${buttonTitle}
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    const reload = () => href ? window.location.href = href : location.reload();

    modal.querySelector(".ok-btn").addEventListener("click", reload);
    setTimeout(reload, 3000);
}