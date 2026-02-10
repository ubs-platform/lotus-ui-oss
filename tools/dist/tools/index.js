var gi = require('node-gtk');
var Gtk = gi.require('Gtk', '3.0');
gi.startLoop();
Gtk.init();
var win = new Gtk.Window();
var box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });
win.on('destroy', function () { return Gtk.mainQuit(); });
win.on('delete-event', function () { return false; });
box.add(new Gtk.Label({ label: 'Lotus/MonaUI Çalışma Alanı Aracı' }));
var addBtn = new Gtk.ColorButton({ label: "DTO Objesini tabloya dönüştürme" });
addBtn.on('clicked', function () {
    Gtk.messageDialog({
        message: "Henüz eklenmedi",
        buttons: Gtk.ButtonsType.OK,
        type: Gtk.MessageType.INFO
    }).run();
});
box.add(addBtn);
win.add(box);
win.showAll();
Gtk.main();
