import React, { useState, useEffect } from 'react';
import { authHelpers, UserProfile, UserRole } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, X, Loader2 } from 'lucide-react';
// NOTE: You will need to implement a useAuth hook to get the current user's role 
// to properly secure this page. For now, we assume the user is authenticated.
// import { useAuth } from '@/hooks/useAuth'; 

const AdminDashboard = () => {
    // We assume the useAuth hook (or similar logic) is used elsewhere to 
    // restrict this page to users where profile.role === 'admin'.
    // const { profile } = useAuth();
    // if (profile?.role !== 'admin') { 
    //    return <div>Unauthorized Access</div>; 
    // }

    const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    /** Fetches the list of users with approval_status = 'pending' */
    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const data = await authHelpers.getPendingProfiles();
            setPendingUsers(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load pending users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    /** Approves or rejects a user using the secure RPC function */
    const handleApproval = async (userId: string, status: 'approved' | 'rejected') => {
        setProcessingId(userId);
        try {
            // Calls the secure SQL function: update_user_approval
            await authHelpers.setApprovalStatus(userId, status);
            toast.success(`User successfully ${status}.`);
            
            // Remove the user from the list locally
            setPendingUsers(prev => prev.filter(user => user.id !== userId));

        } catch (err) {
            console.error(err);
            toast.error(`Failed to ${status} user.`);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
                <p>Loading pending users...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-extrabold mb-10 text-gray-800">👤 Admin Approval Dashboard</h1>
            
            {pendingUsers.length === 0 ? (
                <Card className="shadow-lg">
                    <CardContent className="p-8 text-center text-lg text-muted-foreground">
                        All clear! No users currently awaiting approval.
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {pendingUsers.map(user => (
                        <Card key={user.id} className="shadow-md hover:shadow-xl transition duration-200">
                            <CardHeader className="bg-gray-50 border-b">
                                <CardTitle className="flex justify-between items-center">
                                    <span>{user.full_name} ({user.role.toUpperCase()})</span>
                                    <span className="text-sm font-normal text-muted-foreground">
                                        Joined: {new Date(user.created_at).toLocaleDateString()}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 grid-cols-1 gap-6 p-6">
                                <div>
                                    <h3 className="font-bold mb-1 text-primary">Contact Info</h3>
                                    <p className="text-sm">Phone: {user.phone_number}</p>
                                    <p className="text-sm">Address: {user.address || 'N/A'}</p>
                                    {user.role === 'service_provider' && (
                                        <p className="text-sm">Category: {user.service_category}</p>
                                    )}
                                </div>
                                <div className="col-span-1">
                                    <h3 className="font-bold mb-1 text-primary">Verification Documents</h3>
                                    {user.proof_of_address_url && (
                                        <a href={user.proof_of_address_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline block truncate">
                                            [Proof of Address: {user.proof_of_address_type}]
                                        </a>
                                    )}
                                    {user.identification_document_url && (
                                        <a href={user.identification_document_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline block truncate">
                                            [ID: {user.identification_type}]
                                        </a>
                                    )}
                                    {(!user.proof_of_address_url && !user.identification_document_url) && (
                                        <p className="text-sm text-yellow-600">No documents uploaded.</p>
                                    )}
                                </div>
                                <div className="flex flex-col space-y-2 justify-center">
                                    <Button
                                        onClick={() => handleApproval(user.id, 'approved')}
                                        disabled={processingId === user.id}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {processingId === user.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                        {processingId === user.id ? 'Approving...' : 'Approve User'}
                                    </Button>
                                    <Button
                                        onClick={() => handleApproval(user.id, 'rejected')}
                                        disabled={processingId === user.id}
                                        variant="destructive"
                                    >
                                        {processingId === user.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
                                        {processingId === user.id ? 'Rejecting...' : 'Reject User'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;