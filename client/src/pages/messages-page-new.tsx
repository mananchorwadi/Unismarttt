import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ROLES } from "@shared/schema";
import { DashLayout } from "@/components/dashboard/dash-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getInitials } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, Plus, Send, Paperclip, Phone, Video, MoreHorizontal, 
  Users, Star, Archive, Flag, Trash, Info, FilePlus, Image
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentConversation, setCurrentConversation] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  if (!user) return <div className="hidden"></div>;
  
  const isFaculty = user.role === ROLES.FACULTY;
  
  // Fetch user's conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: async () => {
      const response = await fetch('/api/conversations', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      return response.json();
    },
  });
  
  // Fetch messages for selected conversation
  const { data: conversationMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/conversations', currentConversation, 'messages'],
    enabled: !!currentConversation,
    queryFn: async () => {
      const response = await fetch(`/api/conversations/${currentConversation}/messages`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { conversationId: number; content: string }) => {
      return apiRequest(`/api/messages`, {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', currentConversation, 'messages'] });
      setMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Fetch faculty list for new messages
  const { data: facultyList = [] } = useQuery({
    queryKey: ['/api/faculty'],
    enabled: !isFaculty && showNewMessageDialog,
    queryFn: async () => {
      const response = await fetch('/api/faculty', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch faculty');
      }
      return response.json();
    },
  });
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv: any) => {
    const memberNames = conv.members.map((m: any) => m.fullName).join(' ');
    const lastMessageText = conv.lastMessage?.content || '';
    return memberNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lastMessageText.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Get selected conversation
  const selectedConversation = currentConversation 
    ? conversations.find((c: any) => c.id === currentConversation) 
    : null;
  
  // Format timestamp for message display
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentConversation, conversationMessages]);
  
  // Handle send message
  const handleSendMessage = () => {
    if (message.trim() === "" || !currentConversation) return;
    
    sendMessageMutation.mutate({
      conversationId: currentConversation,
      content: message.trim()
    });
  };

  const getConversationName = (conversation: any) => {
    if (conversation.name) {
      return conversation.name;
    }
    // For individual conversations, show the other person's name
    const otherMember = conversation.members.find((m: any) => m.id !== user.id);
    return otherMember ? otherMember.fullName : "Unknown User";
  };

  const getConversationAvatar = (conversation: any) => {
    const name = getConversationName(conversation);
    return getInitials(name);
  };

  return (
    <DashLayout 
      title="Messages" 
      description="Communicate with students and faculty"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
        <Card className="md:col-span-1 h-full flex flex-col">
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                    <DialogDescription>
                      Create a new conversation with {isFaculty ? 'a student' : 'a faculty member'}.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Recipient</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                        <SelectContent>
                          {facultyList.map((faculty: any) => (
                            <SelectItem key={faculty.id} value={faculty.id.toString()}>
                              {faculty.fullName} ({faculty.universityId})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea 
                        placeholder="Type your message here" 
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowNewMessageDialog(false)}>
                      Send Message
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <div className="px-3 py-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="px-2 pt-2 pb-4">
              {conversationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Loading conversations...</div>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conv: any) => (
                  <div
                    key={conv.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                      currentConversation === conv.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setCurrentConversation(conv.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getConversationAvatar(conv)}</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm truncate">
                          {getConversationName(conv)}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {conv.lastMessage ? formatConversationTime(conv.lastMessage.createdAt) : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage?.content || "No messages yet"}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[0.625rem]">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mb-3 opacity-30" />
                  <p>No conversations found</p>
                  <p className="text-xs">Try a different search term</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-3 h-full flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="px-4 py-3 border-b flex-none">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getConversationAvatar(selectedConversation)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-base">
                        {getConversationName(selectedConversation)}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.members.length} member{selectedConversation.members.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Info className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4 max-w-full overflow-y-auto">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-muted-foreground">Loading messages...</div>
                    </div>
                  ) : conversationMessages.length > 0 ? (
                    conversationMessages.map((msg: any) => {
                      const isUser = msg.senderId === user.id;
                      return (
                        <div 
                          key={msg.id}
                          className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback>{msg.senderAvatar}</AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium ${isUser ? "text-right" : ""}`}>
                                  {msg.senderName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatMessageTime(msg.createdAt)}
                                </span>
                              </div>
                              
                              <div className={`rounded-lg p-3 ${
                                isUser 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-muted"
                              }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                
                                {msg.attachmentName && (
                                  <div className={`mt-2 flex items-center gap-2 rounded-md p-2 ${
                                    isUser ? "bg-primary/80" : "bg-background"
                                  }`}>
                                    <FilePlus className="h-4 w-4" />
                                    <div className="text-xs">
                                      <p className="font-medium">{msg.attachmentName}</p>
                                      <p className="text-xs opacity-80">{msg.attachmentSize}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center py-8 text-center text-muted-foreground">
                      <div>
                        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>No messages yet</p>
                        <p className="text-xs">Start the conversation!</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <CardFooter className="border-t p-3 flex-none">
                <div className="flex items-end gap-2 w-full">
                  <Button variant="ghost" size="icon" className="flex-none">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="relative flex-1">
                    <Textarea 
                      placeholder="Type a message..." 
                      className="resize-none min-h-[2.5rem] max-h-24 py-2 pr-12"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-2 bottom-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleSendMessage}
                        disabled={message.trim() === "" || sendMessageMutation.isPending}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
              <div className="w-full max-w-sm">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p className="mb-6">Select a conversation from the list or start a new one</p>
                <Button 
                  className="mx-auto"
                  onClick={() => setShowNewMessageDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashLayout>
  );
}