export const can = (permission, permissions = []) => {
    // Superadmin bypass
    if (permissions.includes('*')) return true;

    return permissions.includes(permission);
};

export const canAny = (permissionList = [], permissions = []) => {
    // Superadmin bypass
    if (permissions.includes('*')) return true;

    return permissionList.some(permission =>
        permissions.includes(permission)
    );
}