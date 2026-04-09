// src/hooks/notes/useNotes.ts
import { useEffect, useState, useCallback } from 'react';
import { noteService } from '../../services/noteService';
import { Note } from '../../utils/types/data';

export default function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await noteService.getAll();
      setNotes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNoteById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      return await noteService.getById(id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newNote = await noteService.create(data);
      setNotes(prev => [...prev, newNote]);
      return newNote;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBatchNotes = useCallback(async (dataArray: any[]) => {
    try {
      setLoading(true);
      const result = await noteService.createBatch(dataArray);
      if (result.notes.length > 0) {
        setNotes(prev => [...prev, ...result.notes]);
      }
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNote = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await noteService.update(id, data);
      setNotes(prev => prev.map(n => n.id === id ? updated : n));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCloseNote = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const updated = await noteService.close(id);
      setNotes(prev => prev.map(n => n.id === id ? updated : n));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ VERSION CORRIGÉE de handleCloseNotes
  const handleCloseNotes = useCallback(async (ids: string[]) => {
    try {
      setLoading(true);
      const result = await noteService.closeBatch(ids);
      
      // Mettre à jour toutes les notes modifiées
      if (result.success && result.success.length > 0) {
        setNotes(prev => prev.map(note => {
          const updatedNote = result.success.find((u: any) => u.id === note.id);
          return updatedNote || note;
        }));
      }
      
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await noteService.delete(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    error,
    loadNotes,
    handleCloseNote,
    getNoteById,
    createNote,
    createBatchNotes,
    updateNote,
    deleteNote,
    handleCloseNotes, // ✅ Maintenant correct
  };
}