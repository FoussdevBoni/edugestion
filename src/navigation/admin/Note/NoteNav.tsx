import { Route, Routes } from 'react-router-dom'
import NotesPage from '../../../pages/admin/Notes/NotesPages'
import ImportNotesPage from '../../../pages/admin/Notes/ImporteNotes'

export default function NoteNav() {
    return (<Routes>
        <Route path='/' element={<NotesPage />} />
        <Route path='/import' element={<ImportNotesPage />} />

    </Routes>
    )
}
