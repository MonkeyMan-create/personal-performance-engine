import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return <div>Please sign in</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">{user.displayName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="destructive" onClick={logout}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}