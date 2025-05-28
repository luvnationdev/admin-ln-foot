'use client'

import { trpc } from '@/lib/trpc/react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function UserList() {
  const { data: session } = useSession()
  const [search, setSearch] = useState('')
  const { data: users = [], refetch, isLoading } = trpc.users.list.useQuery()
  const { mutate: assignRole, isPending: assigning } =
    trpc.users.assignRole.useMutation()
  const { mutate: removeRole, isPending: removing } =
    trpc.users.removeRole.useMutation()

  const { mutate: toggleActivation, isPending: toggling } =
    trpc.users.toggleActivation.useMutation()

  const isPending = isLoading || assigning || removing

  const handleAssignRole = (userId: string) => {
    if (
      !confirm(
        'Voulez-vous vraiment assigner le rôle admin à cet utilisateur ?'
      )
    )
      return

    assignRole(
      { userId, roleName: 'admin' },
      {
        onSuccess: () => {
          toast.success('Rôle admin assigné avec succès')
          refetch().catch((err) => {
            console.error('Erreur lors du rechargement:', err)
            toast.error('Échec du rechargement')
          })
        },
        onError: (err) => {
          toast.error(`Erreur : ${err.message}`)
        },
      }
    )
  }

  const handleRemoveRole = (userId: string) => {
    if (
      !confirm('Voulez-vous vraiment retirer le rôle admin à cet utilisateur ?')
    )
      return

    removeRole(
      { userId, roleName: 'admin' },
      {
        onSuccess: () => {
          toast.success('Rôle admin retiré avec succès')
          refetch().catch((err) => {
            console.error('Erreur lors du rechargement:', err)
            toast.error('Échec du rechargement')
          })
        },
        onError: (err) => {
          toast.error(`Erreur : ${err.message}`)
        },
      }
    )
  }

  const handleToggleActivation = (userId: string, currentState: boolean) => {
    const action = currentState ? 'désactiver' : 'activer'
    if (!confirm(`Voulez-vous vraiment ${action} cet utilisateur ?`)) return

    toggleActivation(
      { userId, enable: !currentState },
      {
        onSuccess: () => {
          toast.success(`Utilisateur ${!currentState ? 'activé' : 'désactivé'}`)
          refetch().catch((err) => {
            console.error('Erreur lors du rechargement:', err)
            toast.error('Échec du rechargement')
          })
        },
        onError: (err) => toast.error(`Erreur: ${err.message}`),
      }
    )
  }

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase()
    return (
      user.username?.toLowerCase().includes(query) ??
      user.email?.toLowerCase().includes(query) ??
      user.firstName?.toLowerCase().includes(query) ??
      user.lastName?.toLowerCase().includes(query)
    )
  })

  return (
    <div className='p-4 space-y-4'>
      <h2 className='text-xl font-semibold'>Liste des utilisateurs</h2>

      {/* 🔍 Search input */}
      <input
        type='text'
        placeholder='Rechercher par nom, prénom, email...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full border rounded-md px-3 py-2'
      />

      <div className='divide-y border rounded-md'>
        {filteredUsers.map(({ attributes: { roles = [] }, ...user }) => {
          const isAdmin = roles?.includes('admin')

          return (
            <div
              key={user.id}
              className='p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
            >
              <div className='space-y-1'>
                <div className='font-semibold'>{user.username}</div>
                <div className='text-sm text-gray-500'>{user.email}</div>
                <div className='text-sm'>
                  {user.firstName} {user.lastName}
                </div>
                <div
                  className={`text-sm inline-block px-2 py-1 rounded ${
                    user.enabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user.enabled ? 'Activé' : 'Désactivé'}
                </div>
                {roles.length > 0 && (
                  <div className='text-sm mt-2'>
                    <span className='font-medium'>Rôles :</span>{' '}
                    {roles.map((role, idx) => (
                      <span
                        key={idx}
                        className='inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-1'
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {session?.user.email !== user.email && (
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <button
                    onClick={() =>
                      handleToggleActivation(user.id!, !!user.enabled)
                    }
                    disabled={isPending}
                    className={`text-sm py-1.5 px-3 rounded ${
                      user.enabled
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {toggling
                      ? 'Traitement...'
                      : user.enabled
                        ? 'Désactiver'
                        : 'Activer'}
                  </button>

                  {!isAdmin ? (
                    <button
                      onClick={() => handleAssignRole(user.id!)}
                      disabled={isPending}
                      className='bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded text-sm'
                    >
                      {assigning ? 'Assignation...' : 'Assigner rôle admin'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveRole(user.id!)}
                      disabled={isPending}
                      className='bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded text-sm'
                    >
                      {removing ? 'Suppression...' : 'Retirer rôle admin'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
        {filteredUsers.length === 0 && (
          <div className='p-4 text-gray-500 text-sm italic'>
            Aucun utilisateur trouvé.
          </div>
        )}
      </div>
    </div>
  )
}
