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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  if (!user) return null;
  
  const isFaculty = user.role === ROLES.FACULTY;
  
  // Mock conversations data
  const conversations = [
    {
      id: "conv1",
      name: isFaculty ? "Alex Johnson" : "Dr. Michael Reynolds",
      avatar: getInitials(isFaculty ? "Alex Johnson" : "Dr. Michael Reynolds"),
      role: isFaculty ? "Student" : "Professor",
      lastMessage: "When is the next assignment due?",
      timestamp: "10:30 AM",
      unread: 2,
      online: true,
      course: "CS 101: Introduction to Computer Science",
      email: isFaculty ? "alex.j@university.edu" : "m.reynolds@university.edu",
      starred: true
    },
    {
      id: "conv2",
      name: isFaculty ? "Maria Garcia" : "Dr. Sarah Connor",
      avatar: getInitials(isFaculty ? "Maria Garcia" : "Dr. Sarah Connor"),
      role: isFaculty ? "Student" : "Professor",
      lastMessage: "Thank you for the feedback on my project.",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
      course: "CS 205: Data Structures and Algorithms",
      email: isFaculty ? "m.garcia@university.edu" : "s.connor@university.edu",
      starred: false
    },
    {
      id: "conv3",
      name: isFaculty ? "James Wilson" : "Dr. James Wilson",
      avatar: getInitials(isFaculty ? "James Wilson" : "Dr. James Wilson"),
      role: isFaculty ? "Student" : "Professor",
      lastMessage: "I need help with the calculus problem.",
      timestamp: "Yesterday",
      unread: 0,
      online: true,
      course: "MATH 202: Advanced Calculus",
      email: isFaculty ? "j.wilson@university.edu" : "j.wilson@university.edu",
      starred: false
    },
    {
      id: "conv4",
      name: isFaculty ? "Sarah Ahmed" : "Prof. Emily Bronte",
      avatar: getInitials(isFaculty ? "Sarah Ahmed" : "Prof. Emily Bronte"),
      role: isFaculty ? "Student" : "Professor",
      lastMessage: "Can we discuss my essay during office hours?",
      timestamp: "Monday",
      unread: 0,
      online: false,
      course: "ENG 101: English Composition",
      email: isFaculty ? "s.ahmed@university.edu" : "e.bronte@university.edu",
      starred: false
    },
    {
      id: "conv5",
      name: "CS 101 Study Group",
      avatar: "SG",
      role: "Group",
      lastMessage: "Let's meet at the library tomorrow.",
      timestamp: "Sunday",
      unread: 0,
      online: false,
      members: ["Alex Johnson", "Maria Garcia", "David Chen", "You"],
      course: "CS 101: Introduction to Computer Science",
      starred: true
    }
  ];
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get selected conversation
  const selectedConversation = currentConversation 
    ? conversations.find(c => c.id === currentConversation) 
    : null;
  
  // Format timestamp for message display
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Mock messages for the current conversation
  const mockMessages = [
    {
      id: 1,
      sender: isFaculty ? "Alex Johnson" : "Dr. Michael Reynolds",
      senderAvatar: getInitials(isFaculty ? "Alex Johnson" : "Dr. Michael Reynolds"),
      content: "Hello Professor, I have a question about the upcoming assignment.",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
      isUser: !isFaculty
    },
    {
      id: 2,
      sender: user.fullName!,
      senderAvatar: getInitials(user.fullName!),
      content: "Of course, what would you like to know?",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() + 5)),
      isUser: true
    },
    {
      id: 3,
      sender: isFaculty ? "Alex Johnson" : "Dr. Michael Reynolds",
      senderAvatar: getInitials(isFaculty ? "Alex Johnson" : "Dr. Michael Reynolds"),
      content: "I'm not sure about the requirements for the final project. Could you provide more details?",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() + 10)),
      isUser: !isFaculty
    },
    {
      id: 4,
      sender: user.fullName!,
      senderAvatar: getInitials(user.fullName!),
      content: "The final project requires implementing a web application using the concepts we've covered in class. You'll need to include user authentication, database integration, and at least two core features. I'll send you the detailed document.",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() + 15)),
      isUser: true
    },
    {
      id: 5,
      sender: isFaculty ? "Alex Johnson" : "Dr. Michael Reynolds",
      senderAvatar: getInitials(isFaculty ? "Alex Johnson" : "Dr. Michael Reynolds"),
      content: "That would be great, thank you!",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() + 20)),
      isUser: !isFaculty
    },
    {
      id: 6,
      sender: user.fullName!,
      senderAvatar: getInitials(user.fullName!),
      content: "Here's the document with all the requirements. Let me know if you have any other questions.",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() + 25)),
      isUser: true,
      attachment: {
        name: "FinalProjectRequirements.pdf",
        size: "245 KB"
      }
    },
    {
      id: 7,
      sender: isFaculty ? "Alex Johnson" : "Dr. Michael Reynolds",
      senderAvatar: getInitials(isFaculty ? "Alex Johnson" : "Dr. Michael Reynolds"),
      content: "Thank you. When is the deadline for submission?",
      timestamp: new Date(new Date().setHours(new Date().getHours(), new Date().getMinutes() - 20)),
      isUser: !isFaculty
    }
  ];
  
  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentConversation, mockMessages]);
  
  // Handle send message
  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    // In a real app, this would send the message to the API
    console.log("Sending message:", message);
    
    // Clear the input
    setMessage("");
  };
  
  // Mock students/faculty for new message dialog
  const recipients = isFaculty 
    ? [
        { id: "s1", name: "Alex Johnson", role: "Student", course: "CS 101" },
        { id: "s2", name: "Maria Garcia", role: "Student", course: "CS 101" },
        { id: "s3", name: "James Wilson", role: "Student", course: "CS 205" },
        { id: "s4", name: "Sarah Ahmed", role: "Student", course: "MATH 202" },
        { id: "s5", name: "David Chen", role: "Student", course: "ENG 101" },
      ]
    : [
        { id: "f1", name: "Dr. Michael Reynolds", role: "Professor", course: "CS 101" },
        { id: "f2", name: "Dr. Sarah Connor", role: "Professor", course: "CS 205" },
        { id: "f3", name: "Dr. James Wilson", role: "Professor", course: "MATH 202" },
        { id: "f4", name: "Prof. Emily Bronte", role: "Professor", course: "ENG 101" },
      ];
  
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
                      Create a new conversation with a student or faculty member.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <Tabs defaultValue="individual">
                      <TabsList className="mb-4">
                        <TabsTrigger value="individual">Individual</TabsTrigger>
                        <TabsTrigger value="group">Group</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="individual">
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Recipient</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select recipient" />
                              </SelectTrigger>
                              <SelectContent>
                                {recipients.map(recipient => (
                                  <SelectItem key={recipient.id} value={recipient.id}>
                                    {recipient.name} ({recipient.course})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Subject (Optional)</label>
                            <Input placeholder="e.g., Question about assignment" />
                          </div>
                          
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea 
                              placeholder="Type your message here" 
                              rows={4}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="group">
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Group Name</label>
                            <Input placeholder="e.g., CS 101 Study Group" />
                          </div>
                          
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Course</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select course" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cs101">CS 101: Introduction to Computer Science</SelectItem>
                                <SelectItem value="cs205">CS 205: Data Structures and Algorithms</SelectItem>
                                <SelectItem value="math202">MATH 202: Advanced Calculus</SelectItem>
                                <SelectItem value="eng101">ENG 101: English Composition</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">Members</label>
                            <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                              {recipients.map(recipient => (
                                <div key={recipient.id} className="flex items-center mb-2">
                                  <input 
                                    type="checkbox" 
                                    id={recipient.id} 
                                    className="mr-2 h-4 w-4 rounded border-gray-300"
                                  />
                                  <label htmlFor={recipient.id} className="text-sm">
                                    {recipient.name} ({recipient.role})
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid gap-2">
                            <label className="text-sm font-medium">First Message</label>
                            <Textarea 
                              placeholder="Type your message here" 
                              rows={3}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
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
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                      currentConversation === conv.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setCurrentConversation(conv.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{conv.avatar}</AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm truncate">
                          {conv.name}
                          {conv.starred && (
                            <Star className="h-3 w-3 text-yellow-400 ml-1 inline-block" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {conv.timestamp}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[0.625rem]">
                            {conv.unread}
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
                      <AvatarFallback>{selectedConversation.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-base">
                        {selectedConversation.name}
                        {selectedConversation.online && (
                          <Badge variant="outline" className="ml-2 text-xs font-normal border-green-200 text-green-700 bg-green-50">
                            Online
                          </Badge>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.role} • {selectedConversation.course}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Conversation</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Star className="mr-2 h-4 w-4" />
                          {selectedConversation.starred ? "Unstar" : "Star"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Flag className="mr-2 h-4 w-4" />
                          Report
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4 max-w-full overflow-y-auto">
                <div className="space-y-4">
                  {mockMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${msg.isUser ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback>{msg.senderAvatar}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${msg.isUser ? "text-right" : ""}`}>
                              {msg.sender}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(msg.timestamp)}
                            </span>
                          </div>
                          
                          <div className={`rounded-lg p-3 ${
                            msg.isUser 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            
                            {msg.attachment && (
                              <div className={`mt-2 flex items-center gap-2 rounded-md p-2 ${
                                msg.isUser ? "bg-primary/80" : "bg-background"
                              }`}>
                                <FilePlus className="h-4 w-4" />
                                <div className="text-xs">
                                  <p className="font-medium">{msg.attachment.name}</p>
                                  <p className="text-xs opacity-80">{msg.attachment.size}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                        disabled={message.trim() === ""}
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