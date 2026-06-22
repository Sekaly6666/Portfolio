import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSendMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export default function Contact() {
  const { toast } = useToast();
  const sendMessage = useSendMessage();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    sendMessage.mutate({ data: values }, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
        toast({ title: "Message envoyé", description: "Votre message a été envoyé avec succès." });
        setTimeout(() => setIsSuccess(false), 5000);
      },
      onError: () => {
        toast({ variant: "destructive", title: "Erreur", description: "Impossible d'envoyer le message." });
      }
    });
  }

  return (
    <div className="min-h-screen py-12 px-4 container mx-auto">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact</h1>
        <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
        <p className="text-muted-foreground">
          Une question ? Un projet de construction à chiffrer ? N'hésitez pas à me contacter. Je vous répondrai dans les plus brefs délais.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6 flex flex-col gap-8">
              <div className="flex gap-4 items-start">
                <div className="bg-primary/20 p-3 rounded-lg text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Localisation</h3>
                  <p className="text-muted-foreground text-sm">Abidjan, Côte d'Ivoire<br />Disponible pour déplacements</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-accent/20 p-3 rounded-lg text-accent">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Téléphone & WhatsApp</h3>
                  <p className="text-muted-foreground text-sm">+225 00 00 00 00 00</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">contact@ibrahimcisse.pro</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message envoyé !</h3>
                  <p className="text-muted-foreground">Merci de m'avoir contacté. Je vous répondrai sous 24h.</p>
                  <Button className="mt-8" variant="outline" onClick={() => setIsSuccess(false)}>Envoyer un autre message</Button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean Dupont" className="bg-background border-border" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="jean@exemple.com" className="bg-background border-border" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone (Optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="+225 00 00 00 00 00" className="bg-background border-border" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Votre message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Décrivez votre projet ou votre besoin..." 
                              className="min-h-[150px] bg-background border-border" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={sendMessage.isPending}>
                      {sendMessage.isPending ? "Envoi en cours..." : <><Send className="w-4 h-4 mr-2" /> Envoyer le message</>}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
