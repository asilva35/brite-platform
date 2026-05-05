'use client';

import React, { useState, useMemo } from 'react';
import { useConfiguratorStore } from '@/store/useConfiguratorStore';
import { calculateLineItemPricing } from '@/lib/pricing/engine';
import { canTransition } from '@/lib/workflow/transitions';
import { OrderStatus, UserRole } from '@prisma/client';

// UI components from your library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const OptionsPanel = () => {
    const store = useConfiguratorStore();

    // Simulation of user role and order status
    const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.SALES_REP);
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(OrderStatus.QUOTE);

    // 1. Pricing calculation in real time (Memoized)
    const pricing = useMemo(() => {
        return calculateLineItemPricing({
            width: store.width,
            height: store.height,
            productType: store.productType,
            glassType: store.glassType,
            options: [
                store.hasThermalBlind && 'THERMAL_BLIND',
                store.hasSolarShades && 'SOLAR_SHADE',
                store.hasInsectScreen && 'INSECT_SCREEN'
            ].filter(Boolean) as Array<"THERMAL_BLIND" | "SOLAR_SHADE" | "INSECT_SCREEN">,
            markupPercentage: 20, // Markup base suggested
        });
    }, [store]);

    // 2. Status transition handler
    const handleStatusChange = (nextStatus: OrderStatus) => {
        if (!currentStatus && nextStatus === OrderStatus.QUOTE && currentRole === UserRole.SALES_REP) {
            setCurrentStatus(nextStatus);
            //alert(`Status updated to: ${nextStatus}`);
            return;
        }

        const validation = canTransition(currentStatus, nextStatus, currentRole);

        if (validation.success) {
            setCurrentStatus(nextStatus);
            //alert(`Status updated to: ${nextStatus}`);
        } else {
            alert(`Error: ${validation.error}`);
        }
    };

    return (
        <Card className="shadow-lg border-zinc-200">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-zinc-800">Brite 2.0 Configurator</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* SECCIÓN: ROLE SIMULATOR (Only for the Assessment) */}
                <div className="p-4 bg-zinc-100 rounded-lg space-y-3">
                    <Label className="text-xs uppercase tracking-wider text-zinc-500">Admin Simulator</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Simulated Role</Label>
                            <Select value={currentRole} onValueChange={(v) => setCurrentRole(v as UserRole)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.values(UserRole).map(role => (
                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label>Current Status</Label>
                            <div className="h-10 flex items-center px-3 bg-white border rounded-md font-bold text-sm text-blue-600">
                                {currentStatus ? currentStatus : "N/A"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION: DIMENSIONS */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (in)</Label>
                        <Input
                            id="width" type="number"
                            value={store.width}
                            onChange={(e) => store.setDimensions(Number(e.target.value), store.height)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (in)</Label>
                        <Input
                            id="height" type="number"
                            value={store.height}
                            onChange={(e) => store.setDimensions(store.width, Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* SECTION: PRODUCT AND GLASS */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Glass Technology</Label>
                        <Select value={store.glassType} onValueChange={(v) => store.setOption('glassType', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DOUBLE">Double Glazing</SelectItem>
                                <SelectItem value="TRIMAX">Trimax (Triple Pane)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="space-y-0.5">
                            <Label>Thermal Blinds</Label>
                            <p className="text-xs text-zinc-500">Energy efficient internal blinds</p>
                        </div>
                        <Switch
                            checked={store.hasThermalBlind}
                            onCheckedChange={(v) => store.setOption('hasThermalBlind', v)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="space-y-0.5">
                            <Label>Solar Shades</Label>
                            <p className="text-xs text-zinc-500">Energy efficient solar shades</p>
                        </div>
                        <Switch
                            checked={store.hasSolarShades}
                            onCheckedChange={(v) => store.setOption('hasSolarShades', v)}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="space-y-0.5">
                            <Label>Insect Screen</Label>
                            <p className="text-xs text-zinc-500">Insect screens</p>
                        </div>
                        <Switch
                            checked={store.hasInsectScreen}
                            onCheckedChange={(v) => store.setOption('hasInsectScreen', v)}
                        />
                    </div>
                </div>

                {/* SECTION: FINANCIAL SUMMARY (Pricing Engine) */}
                <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-zinc-600">Manufacture Cost</span>
                        <span className="font-mono">${pricing.unitCost.toString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold">Client Price</span>
                        <span className="text-2xl font-bold text-blue-600">${pricing.unitPrice.toString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <Select value={currentStatus || undefined} onValueChange={(v) => handleStatusChange(v as OrderStatus)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.values(OrderStatus).map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* <Button
                            variant="outline"
                            onClick={() => handleStatusChange(OrderStatus.REMEASURE)}
                            className="w-full"
                        >
                            Send to Remeasure
                        </Button>
                        <Button
                            variant="default"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleStatusChange(OrderStatus.READY_FOR_PROD)}
                        >
                            Approve Production
                        </Button> */}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};