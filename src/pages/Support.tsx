
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  HelpCircle, 
  FileText, 
  Phone, 
  Mail 
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    });
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Support Center</h1>
        <p className="text-muted-foreground">Get help with BizManager or contact our support team</p>
      </div>

      <Tabs defaultValue="contact">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-bizblue-600" />
                  Chat Support
                </CardTitle>
                <CardDescription>Chat with our team in real-time</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full bg-bizblue-600 hover:bg-bizblue-700">
                  Start Chat
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-bizblue-600" />
                  Phone Support
                </CardTitle>
                <CardDescription>Call us during business hours</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-bizblue-600">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500">Mon-Fri: 9am - 5pm EST</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-bizblue-600" />
                  Email Support
                </CardTitle>
                <CardDescription>Send us your questions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-bizblue-600">support@bizmanager.com</p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below to get assistance from our team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's your question about?"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your issue in detail"
                    required
                  />
                </div>
                <Button type="submit" className="bg-bizblue-600 hover:bg-bizblue-700">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about BizManager
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I add a new customer?</AccordionTrigger>
                  <AccordionContent>
                    To add a new customer, go to the Customers page and click on the "Add Customer" button. 
                    Fill in the customer details in the form that appears and click "Save".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I track inventory?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Inventory page where you can view all your products. 
                    The system automatically updates stock levels when sales are recorded. 
                    You can manually adjust inventory by selecting a product and clicking "Update Stock".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I create a sales invoice?</AccordionTrigger>
                  <AccordionContent>
                    Go to the Sales page and click "New Sale". Select a customer, add products to the 
                    invoice, set quantities, apply any discounts, and click "Complete Sale". 
                    You can then choose to email the invoice directly to the customer.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I generate reports?</AccordionTrigger>
                  <AccordionContent>
                    Visit the Reports page and select the type of report you need (sales, inventory, etc.). 
                    Choose your preferred date range and other filters, then click "Generate Report". 
                    You can export the report as PDF or CSV.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I change my account settings?</AccordionTrigger>
                  <AccordionContent>
                    Click on your profile icon in the sidebar and select "Settings". 
                    From there, you can update your profile information, change your password, 
                    and manage other account preferences.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Browse our comprehensive guides and tutorials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <FileText className="h-6 w-6 text-bizblue-600" />
                  <div>
                    <h3 className="font-semibold">Getting Started Guide</h3>
                    <p className="text-sm text-gray-500 mb-2">Learn the basics of BizManager</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <FileText className="h-6 w-6 text-bizblue-600" />
                  <div>
                    <h3 className="font-semibold">Customer Management</h3>
                    <p className="text-sm text-gray-500 mb-2">How to manage your customers effectively</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <FileText className="h-6 w-6 text-bizblue-600" />
                  <div>
                    <h3 className="font-semibold">Inventory Management</h3>
                    <p className="text-sm text-gray-500 mb-2">Tips for tracking and optimizing inventory</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border">
                  <FileText className="h-6 w-6 text-bizblue-600" />
                  <div>
                    <h3 className="font-semibold">Sales & Invoicing</h3>
                    <p className="text-sm text-gray-500 mb-2">Complete guide to sales management</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-bizblue-600 hover:bg-bizblue-700">
                View All Documentation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Support;
