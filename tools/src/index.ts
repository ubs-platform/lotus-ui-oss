const gi = require('node-gtk')
const Gtk = gi.require('Gtk', '3.0')

gi.startLoop()
Gtk.init()

const win = new Gtk.Window()
let box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL })
win.on('destroy', () => Gtk.mainQuit())
win.on('delete-event', () => false)

box.add(new Gtk.Label({ label: 'Lotus/MonaUI Çalışma Alanı Aracı' }))
const addBtn = new Gtk.ColorButton({ label: "DTO Objesini tabloya dönüştürme" })
addBtn.on('clicked', () => {
    Gtk.messageDialog({
        message: "Henüz eklenmedi",
        buttons: Gtk.ButtonsType.OK,
        type: Gtk.MessageType.INFO
    }).run()
})
box.add(addBtn)
win.add(box)
win.showAll()
Gtk.main()