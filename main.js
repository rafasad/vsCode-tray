const { app, Tray, Menu, dialog, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

let tray = null;
const menuItems = [];

// Atualiza o menu com os projetos salvos.
function updateMenu() {
  const pathList = fs.readFileSync('paths.txt', 'utf8').split('\n');

  pathList.forEach((p) => {
    if (p) {
      menuItems.push({
        label: p,
        click() {
          exec(`code ${p}`);
        },
      });
    }
  });
}

function createTray() {
  const image = nativeImage.createFromPath(
    path.join(__dirname, 'assets/icon.png')
  );

  tray = new Tray(image.resize({ width: 16, height: 16 }));

  tray.setToolTip('Minha aplicação');

  updateMenu();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Adicionar Projeto',
      click() {
        dialog
          .showOpenDialog({
            properties: ['openDirectory'],
          })
          .then((result) => {
            fs.appendFileSync('paths.txt', `${result.filePaths[0]}\n`);
            updateMenu();
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    { type: 'separator' },
    ...menuItems,
  ]);

  // Adiciona o menu ao ícone.
  tray.setContextMenu(contextMenu);
}

// Cria o ícone quando o Electron estiver pronto.
app.whenReady().then(createTray);
