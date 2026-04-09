import { useEffect, useState, useCallback } from 'react'
import { ecoleInfosService } from '../../services/ecoleInfosService'
import { EcoleInfo } from '../../utils/types/data'

export default function useEcoleInfos() {
    const [ecoleInfos, setEcoleInfos] = useState<EcoleInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const getEcoleInfos = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await ecoleInfosService.get()
            setEcoleInfos(data)
        } catch (error: any) {
            setError(error.message || "Erreur lors du chargement des informations de l'école")
            console.error("Erreur useEcoleInfos:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    const createEcoleInfos = useCallback(async (data: any) => {
        setLoading(true)
        setError(null)
        try {
            const newEcole = await ecoleInfosService.create(data)
            setEcoleInfos(newEcole)
            return { success: true, data: newEcole }
        } catch (error: any) {
            setError(error.message || "Erreur lors de la création")
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }, [])

    const updateEcoleInfos = useCallback(async (data: any) => {
        setLoading(true)
        setError(null)
        try {
            const updatedEcole = await ecoleInfosService.update(data)
            setEcoleInfos(updatedEcole)
            return { success: true, data: updatedEcole }
        } catch (error: any) {
            setError(error.message || "Erreur lors de la mise à jour")
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }, [])

    const deleteEcoleInfos = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            await ecoleInfosService.delete()
            setEcoleInfos(null)
            return { success: true }
        } catch (error: any) {
            setError(error.message || "Erreur lors de la suppression")
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        getEcoleInfos()
    }, [getEcoleInfos])

    return {
        ecoleInfos,
        error,
        loading,
        getEcoleInfos,
        createEcoleInfos,
        updateEcoleInfos,
        deleteEcoleInfos
    }
}