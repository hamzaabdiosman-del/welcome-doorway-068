import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Service {
  id: number;
  nom: string;
  description: string;
  prix: number;
  duree: number;
  unite_duree: "minutes" | "heures";
  categorie: string;
}

const CATEGORIES = [
  "Consultation",
  "Maintenance",
  "Formation",
  "Développement",
  "Design",
  "Marketing",
  "Autre",
];

const initialServices: Service[] = [
  {
    id: 1,
    nom: "Consultation stratégique",
    description: "Analyse et recommandations pour votre entreprise",
    prix: 150,
    duree: 60,
    unite_duree: "minutes",
    categorie: "Consultation",
  },
  {
    id: 2,
    nom: "Formation React",
    description: "Formation complète sur React et TypeScript",
    prix: 500,
    duree: 3,
    unite_duree: "heures",
    categorie: "Formation",
  },
];

const emptyForm = {
  nom: "",
  description: "",
  prix: "",
  duree: "",
  unite_duree: "minutes" as "minutes" | "heures",
  categorie: "",
};

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!form.description.trim()) newErrors.description = "La description est requise";
    if (!form.prix || Number(form.prix) <= 0) newErrors.prix = "Le prix doit être supérieur à 0";
    if (!form.duree || Number(form.duree) <= 0) newErrors.duree = "La durée doit être supérieure à 0";
    if (!form.categorie) newErrors.categorie = "La catégorie est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const serviceData: Service = {
      id: editingId ?? Date.now(),
      nom: form.nom.trim(),
      description: form.description.trim(),
      prix: Number(form.prix),
      duree: Number(form.duree),
      unite_duree: form.unite_duree,
      categorie: form.categorie,
    };

    if (editingId) {
      setServices((prev) => prev.map((s) => (s.id === editingId ? serviceData : s)));
      toast({ title: "Service modifié", description: `"${serviceData.nom}" a été mis à jour.` });
    } else {
      setServices((prev) => [...prev, serviceData]);
      toast({ title: "Service créé", description: `"${serviceData.nom}" a été ajouté.` });
    }

    resetForm();
  };

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  const startEdit = (service: Service) => {
    setForm({
      nom: service.nom,
      description: service.description,
      prix: String(service.prix),
      duree: String(service.duree),
      unite_duree: service.unite_duree,
      categorie: service.categorie,
    });
    setEditingId(service.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = () => {
    if (deleteId) {
      const service = services.find((s) => s.id === deleteId);
      setServices((prev) => prev.filter((s) => s.id !== deleteId));
      toast({ title: "Service supprimé", description: `"${service?.nom}" a été supprimé.`, variant: "destructive" });
      setDeleteId(null);
      setDialogOpen(false);
      if (editingId === deleteId) resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion des Services</h1>
            <p className="text-sm text-muted-foreground">Créez, modifiez et gérez vos services</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 p-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingId ? "Modifier le service" : "Créer un nouveau service"}
            </CardTitle>
            <CardDescription>
              {editingId
                ? "Modifiez les informations du service ci-dessous"
                : "Remplissez les informations pour ajouter un service"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du service</Label>
                <Input
                  id="nom"
                  placeholder="Ex: Consultation stratégique"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className={errors.nom ? "border-destructive" : ""}
                />
                {errors.nom && <p className="text-sm text-destructive">{errors.nom}</p>}
              </div>

              {/* Prix */}
              <div className="space-y-2">
                <Label htmlFor="prix">Prix (€)</Label>
                <Input
                  id="prix"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 150.00"
                  value={form.prix}
                  onChange={(e) => setForm({ ...form, prix: e.target.value })}
                  className={errors.prix ? "border-destructive" : ""}
                />
                {errors.prix && <p className="text-sm text-destructive">{errors.prix}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le service..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              {/* Durée */}
              <div className="space-y-2">
                <Label htmlFor="duree">Durée</Label>
                <div className="flex gap-2">
                  <Input
                    id="duree"
                    type="number"
                    min="1"
                    placeholder="Ex: 60"
                    value={form.duree}
                    onChange={(e) => setForm({ ...form, duree: e.target.value })}
                    className={errors.duree ? "border-destructive" : ""}
                  />
                  <Select
                    value={form.unite_duree}
                    onValueChange={(v) => setForm({ ...form, unite_duree: v as "minutes" | "heures" })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="heures">Heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.duree && <p className="text-sm text-destructive">{errors.duree}</p>}
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={form.categorie}
                  onValueChange={(v) => setForm({ ...form, categorie: v })}
                >
                  <SelectTrigger className={errors.categorie ? "border-destructive" : ""}>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categorie && <p className="text-sm text-destructive">{errors.categorie}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-3 sm:col-span-2">
                <Button type="submit">
                  {editingId ? "Enregistrer les modifications" : "Créer le service"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Services existants ({services.length})</CardTitle>
            <CardDescription>Liste de tous les services disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                Aucun service pour l'instant. Créez-en un ci-dessus.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.nom}</TableCell>
                      <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                        {service.description}
                      </TableCell>
                      <TableCell>{service.prix.toFixed(2)} €</TableCell>
                      <TableCell>
                        {service.duree} {service.unite_duree}
                      </TableCell>
                      <TableCell>
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          {service.categorie}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(service)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeleteId(service.id);
                              setDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete confirmation dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
