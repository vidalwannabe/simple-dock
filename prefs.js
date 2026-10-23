import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class SimpleDockPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        window._settings = settings; // evita que seja coletado pelo GC

        const page = new Adw.PreferencesPage({
            title: 'Geral',
            icon_name: 'preferences-system-symbolic',
        });
        const group = new Adw.PreferencesGroup({title: 'Aparência'});
        page.add(group);

        // Número
        const iconSize = new Adw.SpinRow({
            title: 'Tamanho dos ícones',
            adjustment: new Gtk.Adjustment({lower: 16, upper: 128, step_increment: 2}),
        });
        settings.bind('icon-size', iconSize, 'value', Gio.SettingsBindFlags.DEFAULT);
        group.add(iconSize);

        // Liga/desliga
        const autohide = new Adw.SwitchRow({title: 'Esconder automaticamente'});
        settings.bind('autohide', autohide, 'active', Gio.SettingsBindFlags.DEFAULT);
        group.add(autohide);

        // Lista de opções
        const positions = ['bottom', 'top', 'left', 'right'];
        const position = new Adw.ComboRow({
            title: 'Posição',
            model: Gtk.StringList.new(['Embaixo', 'Em cima', 'Esquerda', 'Direita']),
            selected: positions.indexOf(settings.get_string('position')),
        });
        position.connect('notify::selected', () => {
            settings.set_string('position', positions[position.selected]);
        });
        group.add(position);

        window.add(page);
    }
}
