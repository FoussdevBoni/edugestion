import { useState, useCallback, useEffect } from 'react'
import { Eleve } from '../../utils/types/data'
import { elevesService, GetElevesOptions } from '../../services/elevesService'

interface Props {
  options: GetElevesOptions 
}

export default function useEleves({ options }: Props) {
  const [eleves, setEleves] = useState<Eleve[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getEleves = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await elevesService.getAll(options)
      setEleves(data)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement')
      console.error('Erreur getEleves:', err)
    } finally {
      setLoading(false)
    }
  }, [options])

  const createEleve = async (payload: { eleveId: string; classe: string; anneeScolaire: string; statut?: string }) => {
    try {
      const newEleve = await elevesService.create(payload)
      setEleves(prev => [...prev, newEleve])
      return newEleve
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création')
      throw err
    }
  }

  const updateEleve = async (id: string, payload: Partial<{ classe?: string; anneeScolaire?: string; statut?: string }>) => {
    try {
      const updatedEleve = await elevesService.update(id, payload)
      setEleves(prev => prev.map(e => e.id === id ? updatedEleve : e))
      return updatedEleve
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour')
      throw err
    }
  }

  const deleteEleve = async (id: string) => {
    try {
      await elevesService.delete(id)
      setEleves(prev => prev.filter(e => e.id !== id))
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression')
      throw err
    }
  }

  useEffect(() => {
    getEleves()
  }, [getEleves])

  return {
    eleves,
    loading,
    error,
    getEleves,
    createEleve,
    updateEleve,
    deleteEleve
  }
}