import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: any;
  onSuccess: () => void;
}

export function StaffFormDialog({ open, onOpenChange, staff, onSuccess }: StaffFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<{ id: string; sitename: string; }[]>([]);
  const [races, setRaces] = useState<{ id: string; eng: string; }[]>([]);
  const [religions, setReligions] = useState<{ id: string; eng: string; }[]>([]);
  const [nationalities, setNationalities] = useState<{ id: string; eng: string; }[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<{ id: string; eng: string; }[]>([]);
  const [positions, setPositions] = useState<{ id: string; name: string; }[]>([]);
  const [genders, setGenders] = useState<{ id: string; eng: string; }[]>([]);
  const [banks, setBanks] = useState<{ id: string; bank_name: string; }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          sitesRes,
          racesRes,
          religionsRes,
          nationalitiesRes,
          maritalRes,
          positionsRes,
          gendersRes,
          banksRes
        ] = await Promise.all([
          supabase.from("nd_site_profile").select("id, sitename"),
          supabase.from("nd_races").select("id, eng"),
          supabase.from("nd_religion").select("id, eng"),
          supabase.from("nd_nationalities").select("id, eng"),
          supabase.from("nd_marital_status").select("id, eng"),
          supabase.from("nd_position").select("id, name"),
          supabase.from("nd_genders").select("id, eng"),
          supabase.from("nd_bank_list").select("id, bank_name")
        ]);

        // Transform data to ensure string IDs
        if (sitesRes.data) {
          setSites(sitesRes.data.map(item => ({
            id: item.id.toString(),
            sitename: item.sitename
          })));
        }

        if (racesRes.data) {
          setRaces(racesRes.data.map(item => ({
            id: item.id.toString(),
            eng: item.eng
          })));
        }

        if (religionsRes.data) {
          setReligions(religionsRes.data.map(item => ({
            id: item.id.toString(),
            eng: item.eng
          })));
        }

        if (nationalitiesRes.data) {
          setNationalities(nationalitiesRes.data.map(item => ({
            id: item.id.toString(),
            eng: item.eng
          })));
        }

        if (maritalRes.data) {
          setMaritalStatuses(maritalRes.data.map(item => ({
            id: item.id.toString(),
            eng: item.eng
          })));
        }

        if (positionsRes.data) {
          setPositions(positionsRes.data.map(item => ({
            id: item.id.toString(),
            name: item.name
          })));
        }

        if (gendersRes.data) {
          setGenders(gendersRes.data.map(item => ({
            id: item.id.toString(),
            eng: item.eng
          })));
        }

        if (banksRes.data) {
          setBanks(banksRes.data.map(item => ({
            id: item.id.toString(),
            bank_name: item.bank_name
          })));
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const staffData = {
        fullname: formData.get("fullname") as string,
        ic_no: formData.get("ic_no") as string,
        mobile_no: formData.get("mobile_no") as string,
        work_email: formData.get("work_email") as string,
        personal_email: formData.get("personal_email") as string,
        qualification: formData.get("qualification") as string,
        dob: formData.get("dob") as string,
        place_of_birth: formData.get("place_of_birth") as string,
        race_id: parseInt(formData.get("race_id") as string),
        religion_id: parseInt(formData.get("religion_id") as string),
        nationality_id: parseInt(formData.get("nationality_id") as string),
        marital_status: parseInt(formData.get("marital_status") as string),
        position_id: parseInt(formData.get("position_id") as string),
        is_active: true,
      };

      if (staff?.id) {
        const { error } = await supabase
          .from("nd_staff_profile")
          .update(staffData)
          .eq("id", staff.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("nd_staff_profile")
          .insert([staffData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Staff ${staff ? "updated" : "created"} successfully`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving staff:", error);
      toast({
        title: "Error",
        description: "Failed to save staff",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{staff ? "Edit Staff" : "Add New Staff"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                defaultValue={staff?.fullname}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="ic_no">IC Number</Label>
              <Input
                id="ic_no"
                name="ic_no"
                defaultValue={staff?.ic_no}
                required
              />
            </div>

            <div>
              <Label htmlFor="mobile_no">Mobile Number</Label>
              <Input
                id="mobile_no"
                name="mobile_no"
                defaultValue={staff?.mobile_no}
                required
              />
            </div>

            <div>
              <Label htmlFor="work_email">Work Email</Label>
              <Input
                id="work_email"
                name="work_email"
                type="email"
                defaultValue={staff?.work_email}
                required
              />
            </div>

            <div>
              <Label htmlFor="personal_email">Personal Email</Label>
              <Input
                id="personal_email"
                name="personal_email"
                type="email"
                defaultValue={staff?.personal_email}
              />
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                defaultValue={staff?.dob}
              />
            </div>

            <div>
              <Label htmlFor="place_of_birth">Place of Birth</Label>
              <Input
                id="place_of_birth"
                name="place_of_birth"
                defaultValue={staff?.place_of_birth}
              />
            </div>

            <div>
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                name="qualification"
                defaultValue={staff?.qualification}
              />
            </div>

            <div>
              <Label htmlFor="race_id">Race</Label>
              <Select name="race_id" defaultValue={staff?.race_id?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select race" />
                </SelectTrigger>
                <SelectContent>
                  {races.map((race) => (
                    <SelectItem key={race.id} value={race.id}>
                      {race.eng}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="religion_id">Religion</Label>
              <Select name="religion_id" defaultValue={staff?.religion_id?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  {religions.map((religion) => (
                    <SelectItem key={religion.id} value={religion.id}>
                      {religion.eng}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nationality_id">Nationality</Label>
              <Select name="nationality_id" defaultValue={staff?.nationality_id?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  {nationalities.map((nationality) => (
                    <SelectItem key={nationality.id} value={nationality.id}>
                      {nationality.eng}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="marital_status">Marital Status</Label>
              <Select name="marital_status" defaultValue={staff?.marital_status?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  {maritalStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.eng}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="position_id">Position</Label>
              <Select name="position_id" defaultValue={staff?.position_id?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
